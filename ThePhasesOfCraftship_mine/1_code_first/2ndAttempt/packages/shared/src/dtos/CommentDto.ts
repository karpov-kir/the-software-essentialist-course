import { MemberDto } from "./MemberDto";
import { VoteDto, VoteType } from "./VoteDto";

export interface CommentDto {
  id: number;
  content: string;
  member: MemberDto;
  votes: VoteDto[];
  // ISO 8601
  createdAt: string;
  currentMemberVoteType?: VoteType;
}
