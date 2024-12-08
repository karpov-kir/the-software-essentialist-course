import { PostDetailsDto } from "@dddforum/shared/dist/dtos/PostDto";
import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";
import { EntityManager } from "@mikro-orm/sqlite";

const getCommentsSubQuery = (currentMemberIdToIncludeVote: number | undefined) => {
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
      `(
        select count(*) from vote_entity
        where comment_id = c.id
          and type = '${VoteType.Upvote}'
          and vote_entity.comment_id is not null
      )`,
    ],
    [
      "downvoteCount",
      `(
        select count(*) from vote_entity
        where comment_id = c.id
          and type = '${VoteType.Downvote}'
          and vote_entity.comment_id is not null
      )`,
    ],
    ["createdAt", "c.created_at"],
    ...(currentMemberIdToIncludeVote ? [["currentMemberVoteType", "cmv.type"]] : []),
  ]
    .filter((column) => column !== undefined)
    .map(([key, value]) => `'${key}', ${value}`)
    .join(", ");
  const joinMember = `left join member_entity m on m.id = c.member_id`;
  const joinUser = `left join user_entity u on u.id = m.user_id`;
  const joinCurrentMemberVote = currentMemberIdToIncludeVote
    ? `left join vote_entity as cmv on cmv.comment_id = c.id and cmv.member_id = :currentMemberIdToIncludeVote`
    : undefined;
  const joins = [joinMember, joinUser, joinCurrentMemberVote].filter((join) => join !== undefined).join(" ");
  return `(
    select json_group_array(json_object(${jsonObjectProperties}))
    from comment_entity as c
    ${joins}
    where c.post_id = p.id
  ) as comments`;
};

export const fetchPostDetails = async (
  em: EntityManager,
  postId: number,
  {
    // Include the current member's vote on each post
    currentMemberIdToIncludeVote,
  }: { currentMemberIdToIncludeVote?: number } = {},
): Promise<PostDetailsDto | undefined> => {
  const upvoteCountSubQuery = `(
    select count(*) from vote_entity
    where post_id = p.id
          and type = '${VoteType.Upvote}'
          and vote_entity.comment_id is null
  ) as upvoteCount`;
  const downvoteCountSubQuery = `(
    select count(*) from vote_entity
    where post_id = p.id
          and type = '${VoteType.Downvote}'
          and vote_entity.comment_id is null
  ) as downvoteCount`;
  const joinMember = `left join member_entity as m on m.id = p.member_id`;
  const joinUser = `left join user_entity as u on u.id = m.user_id`;
  const joinCurrentMemberVote = currentMemberIdToIncludeVote
    ? `left join vote_entity as cmv
        on cmv.post_id = p.id 
          and cmv.member_id = :currentMemberIdToIncludeVote
          and cmv.comment_id is null`
    : undefined;
  const joins = [joinMember, joinUser, joinCurrentMemberVote].filter((join) => join !== undefined).join(" ");
  const selectColumns = [
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

    ...(currentMemberIdToIncludeVote ? ["cmv.id as currentMemberVote_id", "cmv.type as currentMemberVote_type"] : []),

    upvoteCountSubQuery,
    downvoteCountSubQuery,
    getCommentsSubQuery(currentMemberIdToIncludeVote),
  ]
    .filter((column) => column !== undefined)
    .join(", ");

  const query = `
    select ${selectColumns}
    from post_entity as p
    ${joins}
    where p.id = :postId
    order by p.created_at desc
    limit 1
  `;

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
