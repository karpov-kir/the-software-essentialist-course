import { CommentDto } from "./CommentDto";
import { MemberDto } from "./MemberDto";
import { VoteDto, VoteType } from "./VoteDto";

export interface PostDetailsDto {
  id: number;
  title: string;
  content: string;
  member: MemberDto;
  comments: CommentDto[];
  votes: VoteDto[];
  // ISO 8601
  createdAt: string;
  currentMemberVoteType?: VoteType;
}

export interface PostPreviewDto extends Omit<PostDetailsDto, "comments"> {
  votesFromComments: VoteDto[];
  commentCount: number;
}
