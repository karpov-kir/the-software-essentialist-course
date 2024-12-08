import { PostDetailsDto } from "@dddforum/shared/dist/dtos/PostDto";
import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";
import { Alert, Center, Loader, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { useParams } from "react-router";

import { ApiClient, ServerErrorResponse } from "../../ApiClient";
import { PostRow } from "../../components/PostRow";
import { currentUserAtom } from "../../root/currentUserAtom";
import { computePostCommentVotes, computePostVotes } from "../../utils/computeVotes";
import { CommentRow } from "./CommentRow";

export function PostDetailsPage() {
  const { id } = useParams();
  const { post, error, voteOnComment, voteOnPost } = useFetchPost(id!);

  if (error) {
    if (error instanceof ServerErrorResponse && error.status === 404) {
      return <Alert color="orange">Post does not exist</Alert>;
    }

    return (
      <Alert color="red">Oops! Something went wrong and we could not load post details. Please try again later.</Alert>
    );
  }

  if (!post) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <Fragment>
      <PostRow post={post} full={true} onVote={voteOnPost} />
      <Title order={3} mb="md">
        All commentaries
      </Title>
      {post.comments.map((comment) => (
        <CommentRow key={comment.id} comment={comment} onVote={voteOnComment} />
      ))}
    </Fragment>
  );
}

const useFetchPost = (id: string) => {
  const [post, setPost] = useState<PostDetailsDto | undefined>();
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    const abortController = new AbortController();

    new ApiClient()
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

  const [currentUser] = useAtom(currentUserAtom);

  const voteOnPost = (postId: number, voteType: VoteType, action: "add" | "remove") => {
    if (!currentUser) {
      notifications.show({
        message: "You need to be signed in to vote",
        color: "orange",
      });
      return;
    }

    // Best effort, no need to wait for the vote to be processed or to handle errors
    new ApiClient().voteOnPost(postId, voteType, action).catch((error) => {
      console.error(`Failed to vote (${action}) on post ${postId}`, error);
    });

    if (post) {
      setPost(computePostVotes(post, voteType, action));
    }
  };

  const voteOnComment = (commentId: number, voteType: VoteType, action: "add" | "remove") => {
    if (!currentUser) {
      notifications.show({
        message: "You need to be signed in to vote",
        color: "orange",
      });
      return;
    }

    // Best effort, no need to wait for the vote to be processed or to handle errors
    new ApiClient().voteOnComment(commentId, voteType, action).catch((error) => {
      console.error(`Failed to vote (${action}) on comment ${commentId}`, error);
    });

    if (post) {
      setPost(computePostCommentVotes(post, commentId, voteType, action));
    }
  };

  return { post, error, voteOnComment, voteOnPost };
};
