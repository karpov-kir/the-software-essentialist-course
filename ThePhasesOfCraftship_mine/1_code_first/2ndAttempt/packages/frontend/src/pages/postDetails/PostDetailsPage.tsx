import { CommentDto } from "@dddforum/shared/dist/dtos/CommentDto";
import { PostDetailsDto } from "@dddforum/shared/dist/dtos/PostDto";
import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";
import { ActionIcon, Alert, Box, Group, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCaretDown, IconCaretUp } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { useParams } from "react-router";

import { ApiClient, ServerErrorResponse } from "../../ApiClient";
import { Meta } from "../../components/Meta";
import { PostRow } from "../../components/PostRow";
import { currentUserAtom } from "../../root/currentUserAtom";
import { getVoteDirection } from "../../utils/getVoteDirection";

function CommentRating({
  comment,
  onVote,
}: {
  comment: CommentDto;
  onVote: (commentId: number, voteType: VoteType, action: "add" | "remove") => void;
}) {
  const { votes } = comment;
  const [latestUserCommentVote, setLatestUserCommentVote] = useState<VoteType | undefined>(
    // Use the latest stored on the backend vote as the initial state
    comment.currentMemberVoteType,
  );

  // This includes the latest stored on the backend vote from the user
  let rating = votes.reduce((rating, vote) => {
    return rating + getVoteDirection(vote.type);
  }, 0);

  // Since we track what the user voted on the frontend we remove the latest stored on the backend vote
  if (comment.currentMemberVoteType) {
    rating -= getVoteDirection(comment.currentMemberVoteType);
  }

  // Use the latest clicked or stored on the backend vote from the user
  if (latestUserCommentVote) {
    rating += getVoteDirection(latestUserCommentVote);
  }

  const upvoteColor = latestUserCommentVote === VoteType.Upvote ? "green" : undefined;
  const downvoteColor = latestUserCommentVote === VoteType.Downvote ? "red" : undefined;

  const handleVote = (voteType: VoteType) => {
    const action = latestUserCommentVote === voteType ? "remove" : "add";
    onVote(comment.id, voteType, action);
    // Display the vote immediately optimistically
    setLatestUserCommentVote(latestUserCommentVote === voteType ? undefined : voteType);
  };

  return (
    <Group align="center" gap="xs" wrap="nowrap">
      <ActionIcon variant="light" color={upvoteColor} w={35} size="sm" onClick={() => handleVote(VoteType.Upvote)}>
        <IconCaretUp />
      </ActionIcon>
      <Text fw={500}>{rating}</Text>
      <ActionIcon variant="light" color={downvoteColor} w={35} size="sm" onClick={() => handleVote(VoteType.Downvote)}>
        <IconCaretDown />
      </ActionIcon>
    </Group>
  );
}

function CommentRow({
  comment,
  onVote,
}: {
  comment: CommentDto;
  onVote: (commentId: number, voteType: VoteType, action: "add" | "remove") => void;
}) {
  return (
    <Box mb="lg">
      <Group mb="sm" wrap="nowrap" gap="xs">
        <CommentRating comment={comment} onVote={onVote} />
        <Meta createdAt={new Date(comment.createdAt)} member={comment.member} />
      </Group>
      <Text style={{ wordBreak: "break-all" }}>{comment.content}</Text>
    </Box>
  );
}

const useFetchPost = (id: string) => {
  const [post, setPost] = useState<PostDetailsDto | undefined>();
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    const apiClient = new ApiClient();
    const abortController = new AbortController();

    apiClient
      .getPost(id, { abortSignal: abortController.signal })
      .then((fetchedPost) => {
        setPost(fetchedPost);
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }

        console.error(`Failed to fetch post ${id}`, error);
        setError(error);
      });

    return () => {
      abortController.abort();
    };
  }, [id]);

  return { post, error };
};

export function PostDetailsPage() {
  const { id } = useParams();
  const { post, error } = useFetchPost(id!);
  const [currentUser] = useAtom(currentUserAtom);

  const handleVoteOnComment = (commentId: number, voteType: VoteType, action: "add" | "remove") => {
    if (!currentUser) {
      notifications.show({
        message: "You need to be signed in to vote",
        color: "orange",
      });
      return;
    }

    const apiClient = new ApiClient();

    // Best effort, no need to wait for the vote to be processed or to handle errors
    if (action === "add") {
      apiClient.voteOnComment(commentId, voteType).catch((error) => {
        console.error(`Failed to vote on comment ${commentId}`, error);
      });
    } else {
      apiClient.removeVoteOnComment(commentId).catch((error) => {
        console.error(`Failed to remove vote on comment ${commentId}`, error);
      });
    }
  };

  if (error) {
    if (error instanceof ServerErrorResponse && error.status === 404) {
      return <Alert color="orange">Post does not exist</Alert>;
    }

    return (
      <Alert color="red">Oops! Something went wrong and we could not load post details. Please try again later.</Alert>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <Fragment>
      <PostRow post={post} full={true} />
      <Title order={3} mb="md">
        All commentaries
      </Title>
      {post.comments.map((comment) => (
        <CommentRow key={comment.id} comment={comment} onVote={handleVoteOnComment} />
      ))}
    </Fragment>
  );
}
