import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";

export const getVoteDirection = (voteType: VoteType) => {
  return voteType === VoteType.Upvote ? 1 : -1;
};
