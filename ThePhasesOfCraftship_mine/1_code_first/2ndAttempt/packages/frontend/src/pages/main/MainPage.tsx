import { PostPreviewDto, PostSort } from "@dddforum/shared/dist/dtos/PostDto";
import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";
import { Alert, Center, Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";

import { ApiClient } from "../../ApiClient";
import { PostRow } from "../../components/PostRow";
import { currentUserAtom } from "../../root/currentUserAtom";
import { computePostVotes } from "../../utils/computeVotes";
import { PostSortSwitcher } from "./PostSortSwitcher";

export function MainPage() {
  const [sort, setSort] = useState<PostSort>(PostSort.Popular);
  const { posts, error, voteOnPost, isLoading } = useFetchPosts(sort);

  const renderPosts = () => {
    if (error) {
      return <Alert color="red">Oops! Something went wrong and we could not load posts. Please try again later.</Alert>;
    }

    if (isLoading) {
      return (
        <Center>
          <Loader />
        </Center>
      );
    }

    return posts.map((post) => <PostRow key={post.id} post={post} onVote={voteOnPost} />);
  };

  return (
    <Fragment>
      <PostSortSwitcher sort={sort} onChange={setSort} />
      {renderPosts()}
    </Fragment>
  );
}

const useFetchPosts = (sort: PostSort) => {
  const [posts, setPosts] = useState<PostPreviewDto[]>([]);
  const [error, setError] = useState<Error | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    setIsLoading(true);

    new ApiClient()
      .getPosts(sort, {
        abortSignal: abortController.signal,
      })
      .then((fetchedPosts) => {
        setPosts(fetchedPosts);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Failed to fetch posts", error);
        setError(error);
        setIsLoading(false);
      });

    return () => {
      abortController.abort();
    };
  }, [sort]);

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

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return computePostVotes(post, voteType, action);
        }

        return post;
      }),
    );
  };

  return { posts, error, voteOnPost, isLoading };
};
