import { PostPreviewDto } from "@dddforum/shared/dist/dtos/PostDto";
import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";
import { EntityManager } from "@mikro-orm/sqlite";

export const fetchPostPreviews = async (
  em: EntityManager,
  {
    // Include the current member's vote on each post
    currentMemberIdToIncludeVote,
    // Select only posts with 4 or more comments
    onlyPopular,
    // Select only posts created in the last 22 days
    onlyNew,
  }: { currentMemberIdToIncludeVote?: number; onlyPopular?: boolean; onlyNew?: boolean } = {},
): Promise<PostPreviewDto[]> => {
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
        .from("vote_entity")
        .count("*")
        .as("upvoteCount")
        .where("post_id", knex.raw("p.id"))
        .where("type", VoteType.Upvote)
        .whereNull("comment_id"),
      knex
        .from("vote_entity")
        .count("*")
        .as("downvoteCount")
        .where("post_id", knex.raw("p.id"))
        .where("type", VoteType.Downvote)
        .whereNull("comment_id"),

      knex
        .from("vote_entity")
        .count("*")
        .as("commentsUpvoteCount")
        .where("post_id", knex.raw("p.id"))
        .where("type", VoteType.Upvote)
        .whereNotNull("comment_id"),
      knex
        .from("vote_entity")
        .count("*")
        .as("commentsDownvoteCount")
        .where("post_id", knex.raw("p.id"))
        .where("type", VoteType.Downvote)
        .whereNotNull("comment_id"),
      knex.from("comment_entity").count("*").as("commentCount").where("post_id", knex.raw("p.id")),
    ])
    .leftJoin("member_entity as m", "m.id", "p.member_id")
    .leftJoin("user_entity as u", "u.id", "m.user_id")
    .orderBy("p.created_at", "desc");

  if (currentMemberIdToIncludeVote) {
    queryBuilder.select("cmv.type as currentMemberVote_type", "cmv.id as currentMemberVote_id");
    queryBuilder.leftJoin("vote_entity as cmv", function () {
      this.on("cmv.post_id", "=", "p.id")
        .on("cmv.member_id", "=", knex.raw("?", [currentMemberIdToIncludeVote]))
        .onNull("cmv.comment_id");
    });
  }

  if (onlyPopular) {
    queryBuilder.where("commentCount", ">=", 4);
  }

  if (onlyNew) {
    queryBuilder.whereRaw("date(createdAt / 1000, 'unixepoch') >= datetime('now', '-22 days')");
  }

  const query = queryBuilder.toQuery();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows: Record<string, any>[] = await em.getKnex().raw(query, {
    currentMemberIdToIncludeVote,
  });

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    upvoteCount: row.upvoteCount,
    downvoteCount: row.downvoteCount,
    commentsUpvoteCount: row.commentsUpvoteCount,
    commentsDownvoteCount: row.commentsDownvoteCount,
    commentCount: row.commentCount,
    createdAt: new Date(row.createdAt).toISOString(),
    member: {
      id: row.member_id,
      user: {
        id: row.member_user_id,
        firstName: row.member_user_firstName,
        lastName: row.member_user_lastName,
        email: row.member_user_email,
        username: row.member_user_username,
      },
    },
    currentMemberVoteType: row.currentMemberVote_type,
  }));
};
