export enum VoteType {
  Upvote = "upvote",
  Downvote = "downvote",
}

export interface VoteDto {
  id: number;
  type: VoteType;
}
