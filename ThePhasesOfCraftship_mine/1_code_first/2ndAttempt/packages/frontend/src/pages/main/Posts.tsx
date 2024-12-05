import { PostPreviewDto } from "@dddforum/shared/dist/dtos/PostDto";
import { Alert } from "@mantine/core";
import { useEffect, useState } from "react";

import { ApiClient } from "../../ApiClient";
import { PostRow } from "../../components/PostRow";

const useFetchPosts = () => {
  const [posts, setPosts] = useState<PostPreviewDto[]>([]);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    const apiClient = new ApiClient();
    const abortController = new AbortController();

    apiClient
      .getPosts({
        abortSignal: abortController.signal,
      })
      .then((fetchedPosts) => {
        setPosts(fetchedPosts);
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Failed to fetch posts", error);
        setError(error);
      });

    return () => {
      abortController.abort();
    };
  }, []);

  return { posts, error };
};

export function Posts() {
  const { posts, error } = useFetchPosts();

  if (error) {
    return <Alert color="red">Oops! Something went wrong and we could not load posts. Please try again later.</Alert>;
  }

  return posts.map((post) => <PostRow key={post.id} post={post} />);
}
