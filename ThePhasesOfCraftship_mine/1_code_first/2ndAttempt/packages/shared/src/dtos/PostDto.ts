import { CommentDto } from "./CommentDto";
import { MemberDto } from "./MemberDto";
import { VoteType } from "./VoteDto";

export enum PostSort {
  Popular = "popular",
  New = "new",
  All = "all",
}

export interface PostDetailsDto {
  id: number;
  title: string;
  content: string;
  member: MemberDto;
  upvoteCount: number;
  downvoteCount: number;
  comments: CommentDto[];
  // ISO 8601
  createdAt: string;
  currentMemberVoteType?: VoteType;
}

export interface PostPreviewDto {
  id: number;
  title: string;
  content: string;
  member: MemberDto;
  upvoteCount: number;
  downvoteCount: number;
  commentsUpvoteCount: number;
  commentsDownvoteCount: number;
  commentCount: number;
  // ISO 8601
  createdAt: string;
  currentMemberVoteType?: VoteType;
}
