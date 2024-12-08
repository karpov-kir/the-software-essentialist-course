import { MemberDto } from "./MemberDto";
import { VoteType } from "./VoteDto";

export interface CommentDto {
  id: number;
  content: string;
  member: MemberDto;
  upvoteCount: number;
  downvoteCount: number;
  // ISO 8601
  createdAt: string;
  currentMemberVoteType?: VoteType;
}
