import { PostDetailsDto } from "@dddforum/shared/dist/dtos/PostDto";
import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";
import { EntityManager } from "@mikro-orm/sqlite";

// Selects all post comments as a JSON array
const newCommentsAsJsonSubQuery = (em: EntityManager, currentMemberIdToIncludeVote: number | undefined) => {
  const knex = em.getKnex();

  const jsonObjectProperties = [
    ["id", "c.id"],
    ["content", "c.content"],
    [
      "member",
      `json_object(
        'id', m.id,
        'user', json_object(
          'id', u.id,
          'firstName', u.first_name,
          'lastName', u.last_name,
          'email', u.email,
          'username', u.username
        )
      )`,
    ],
    [
      "upvoteCount",
      `(${knex
        .from("vote_entity")
        .count("*")
        .where("type", VoteType.Upvote)
        .where("comment_id", knex.raw("c.id"))
        .toQuery()})`,
    ],
    [
      "downvoteCount",
      `(${knex
        .from("vote_entity")
        .count("*")
        .where("type", VoteType.Downvote)
        .where("comment_id", knex.raw("c.id"))
        .toQuery()})`,
    ],
    ["createdAt", "c.created_at"],
  ];

  if (currentMemberIdToIncludeVote) {
    jsonObjectProperties.push(["currentMemberVoteType", "cmv.type"]);
  }

  const queryBuilder = knex
    .from("comment_entity as c")
    .select(
      knex.raw(
        `json_group_array(json_object(${jsonObjectProperties.map(([key, value]) => `'${key}', ${value}`).join(", ")}))`,
      ),
    )
    .leftJoin("member_entity as m", "m.id", "c.member_id")
    .leftJoin("user_entity as u", "u.id", "m.user_id")
    .where("c.post_id", knex.raw("p.id"));

  if (currentMemberIdToIncludeVote) {
    queryBuilder.leftJoin("vote_entity as cmv", function () {
      this.on("cmv.comment_id", "=", "c.id").on("cmv.member_id", "=", knex.raw("?", [currentMemberIdToIncludeVote]));
    });
  }

  return queryBuilder;
};

export const fetchPostDetails = async (
  em: EntityManager,
  postId: number,
  {
    // Include the current member's vote on each post
    currentMemberIdToIncludeVote,
  }: { currentMemberIdToIncludeVote?: number } = {},
): Promise<PostDetailsDto | undefined> => {
  const knex = em.getKnex();

  const queryBuilder = knex
    .from("post_entity as p")
    .select([
      "p.id",
      "p.title",
      "p.content",
      "p.created_at as createdAt",

      "m.id as member_id",
      "m.user_id as member_userId",

      "u.id as member_user_id",
      "u.first_name as member_user_firstName",
      "u.last_name as member_user_lastName",
      "u.email as member_user_email",
      "u.username as member_user_username",

      knex
        .from("vote_entity as v")
        .count("*")
        .as("upvoteCount")
        .where("post_id", knex.raw("p.id"))
        .where("type", VoteType.Upvote)
        .whereNull("comment_id"),
      knex
        .from("vote_entity as v")
        .count("*")
        .as("downvoteCount")
        .where("post_id", knex.raw("p.id"))
        .where("type", VoteType.Downvote)
        .whereNull("comment_id"),

      newCommentsAsJsonSubQuery(em, currentMemberIdToIncludeVote).as("comments"),
    ])
    .where("p.id", postId)
    .leftJoin("member_entity as m", "m.id", "p.member_id")
    .leftJoin("user_entity as u", "u.id", "m.user_id")
    .orderBy("p.created_at", "desc")
    .limit(1);

  if (currentMemberIdToIncludeVote) {
    queryBuilder.select("cmv.type as currentMemberVote_type", "cmv.id as currentMemberVote_id");
    queryBuilder.leftJoin("vote_entity as cmv", function () {
      this.on("cmv.post_id", "=", "p.id")
        .on("cmv.member_id", "=", knex.raw("?", [currentMemberIdToIncludeVote]))
        .onNull("cmv.comment_id");
    });
  }

  const query = queryBuilder.toString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows: Record<string, any>[] = await em.getKnex().raw(query, {
    currentMemberIdToIncludeVote,
    postId,
  });
  const firstRow = rows[0];

  if (!firstRow) {
    return undefined;
  }

  return {
    id: firstRow.id,
    title: firstRow.title,
    content: firstRow.content,
    upvoteCount: firstRow.upvoteCount,
    downvoteCount: firstRow.downvoteCount,
    comments: JSON.parse(firstRow.comments) ?? [],
    createdAt: new Date(firstRow.createdAt).toISOString(),
    member: {
      id: firstRow.member_id,
      user: {
        id: firstRow.member_user_id,
        firstName: firstRow.member_user_firstName,
        lastName: firstRow.member_user_lastName,
        email: firstRow.member_user_email,
        username: firstRow.member_user_username,
      },
    },
    currentMemberVoteType: firstRow.currentMemberVote_type,
  };
};
