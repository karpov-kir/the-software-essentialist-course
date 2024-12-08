import { PostDetailsDto, PostPreviewDto } from "@dddforum/shared/dist/dtos/PostDto";
import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";

const computeVoteCount = (
  initialUpvoteCount: number,
  initialDownvoteCount: number,
  currentMemberVoteType: VoteType | undefined,
  action: "add" | "remove",
  voteType: VoteType,
) => {
  const result = {
    upvoteCount: initialUpvoteCount,
    downvoteCount: initialDownvoteCount,
  };

  if (action === "remove" && !currentMemberVoteType) {
    return result;
  }

  if (action === "add" && currentMemberVoteType === voteType) {
    return result;
  }

  const handlers = {
    [`add-${VoteType.Upvote}`]: () => {
      result.upvoteCount += 1;

      // If the current member has already downvoted, we need to remove the downvote as well
      if (currentMemberVoteType === VoteType.Downvote) {
        result.downvoteCount -= 1;
      }
    },
    [`add-${VoteType.Downvote}`]: () => {
      result.downvoteCount += 1;

      // If the current member has already upvoted, we need to remove the upvote as well
      if (currentMemberVoteType === VoteType.Upvote) {
        result.upvoteCount -= 1;
      }
    },
    [`remove-${VoteType.Upvote}`]: () => {
      result.upvoteCount -= 1;
    },
    [`remove-${VoteType.Downvote}`]: () => {
      result.downvoteCount -= 1;
    },
  };

  handlers[`${action}-${voteType}`]();

  return result;
};

export const computePostVotes = <T extends PostPreviewDto | PostDetailsDto>(
  post: T,
  voteType: VoteType,
  action: "add" | "remove",
): T => {
  const { upvoteCount, downvoteCount } = computeVoteCount(
    post.upvoteCount,
    post.downvoteCount,
    post.currentMemberVoteType,
    action,
    voteType,
  );

  return {
    ...post,
    currentMemberVoteType: action === "add" ? voteType : undefined,
    upvoteCount,
    downvoteCount,
  };
};

export const computePostCommentVotes = (
  post: PostDetailsDto,
  commentId: number,
  voteType: VoteType,
  action: "add" | "remove",
) => {
  const updatedComments = post.comments.map((comment) => {
    if (comment.id !== commentId) {
      return comment;
    }

    const { upvoteCount, downvoteCount } = computeVoteCount(
      comment.upvoteCount,
      comment.downvoteCount,
      comment.currentMemberVoteType,
      action,
      voteType,
    );

    return {
      ...comment,
      currentMemberVoteType: action === "add" ? voteType : undefined,
      upvoteCount,
      downvoteCount,
    };
  });

  return {
    ...post,
    comments: updatedComments,
  };
};
