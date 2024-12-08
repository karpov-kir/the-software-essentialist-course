import { MemberDto } from "@dddforum/shared/dist/dtos/MemberDto";
import { PostPreviewDto } from "@dddforum/shared/dist/dtos/PostDto";
import { VoteDto, VoteType } from "@dddforum/shared/dist/dtos/VoteDto";
import { EntityManager } from "@mikro-orm/sqlite";

export class PostPreviewView {
  id!: number;
  title!: string;
  content!: string;
  upvoteCount!: number;
  downvoteCount!: number;
  commentsUpvoteCount!: number;
  commentsDownvoteCount!: number;
  commentCount!: number;
  createdAt!: Date;
  member!: MemberDto;
  currentMemberVote?: VoteDto;
}

export const fetchPostPreviews = async (
  em: EntityManager,
  {
    // Include the current member's vote on each post
    currentMemberIdToIncludeVote,
    // Select only posts with 4 or more comments
    onlyPopular,
    // Select only posts created in the last 20 days
    onlyNew,
  }: { currentMemberIdToIncludeVote?: number; onlyPopular?: boolean; onlyNew?: boolean } = {},
): Promise<PostPreviewDto[]> => {
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
  const commentsUpvoteCountSubQuery = `(
    select count(*) from vote_entity
    where post_id = p.id
      and type = '${VoteType.Upvote}'
      and vote_entity.comment_id is not null
  ) as commentsUpvoteCount`;
  const commentsDownvoteCountSubQuery = `(
    select count(*) from vote_entity
    where post_id = p.id
      and type = '${VoteType.Downvote}'
      and vote_entity.comment_id is not null
  ) as commentsDownvoteCount`;
  const commentCountSubQuery = `(
    select count(*) from comment_entity as c 
    where post_id = p.id
  ) as commentCount`;
  const memberJoin = `left join member_entity as m on m.id = p.member_id`;
  const userJoin = `left join user_entity as u on u.id = m.user_id`;
  const currentMemberVoteJoin = currentMemberIdToIncludeVote
    ? `left join vote_entity as cmv
        on cmv.post_id = p.id 
          and cmv.member_id = :currentMemberIdToIncludeVote
          and cmv.comment_id is null`
    : undefined;
  const joins = [memberJoin, userJoin, currentMemberVoteJoin].filter((join) => join !== undefined).join(" ");
  const whereCriterion = [
    "1 = 1",
    onlyPopular ? `commentCount >= 4` : undefined,
    onlyNew ? `date(createdAt / 1000, 'unixepoch') >= datetime('now', '-20 days')` : undefined,
  ]
    .filter((condition) => condition !== undefined)
    .join(" and ");
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
    commentsUpvoteCountSubQuery,
    commentsDownvoteCountSubQuery,
    commentCountSubQuery,
  ]
    .filter((column) => column !== undefined)
    .join(", ");

  const query = `
    select ${selectColumns}
    from post_entity as p
    ${joins}
    where ${whereCriterion}
    order by p.created_at desc
  `;

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
