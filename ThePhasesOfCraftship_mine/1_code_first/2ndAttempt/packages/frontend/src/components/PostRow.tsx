import { PostDetailsDto, PostPreviewDto } from "@dddforum/shared/dist/dtos/PostDto";
import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";
import { ActionIcon, Flex, Group, Stack, Text } from "@mantine/core";
import { IconCaretDown, IconCaretUp } from "@tabler/icons-react";
import { Link } from "react-router";

import { ApiClient } from "../ApiClient";
import { Meta } from "./Meta";
import classNames from "./PostRow.module.css";

function PostRating({ post }: { post: PostDetailsDto | PostPreviewDto }) {
  const postVotesRating = post.votes.reduce((postRating, vote) => {
    return postRating + (vote.type === VoteType.Upvote ? 1 : -1);
  }, 0);
  const postCommentsRating = 0;

  if ("comments" in post) {
    post.comments.reduce((commentsRating, comment) => {
      return (
        commentsRating +
        comment.votes.reduce((commentRating, vote) => {
          return commentRating + (vote.type === VoteType.Upvote ? 1 : -1);
        }, 0)
      );
    }, 0);
  }

  const totalRating = postVotesRating + postCommentsRating;

  const upvoteColor = post.currentMemberVoteType === VoteType.Upvote ? "green" : undefined;
  const downvoteColor = post.currentMemberVoteType === VoteType.Downvote ? "red" : undefined;

  return (
    <Flex direction="column" align="center">
      <ActionIcon
        variant="light"
        color={upvoteColor}
        w={40}
        onClick={() => new ApiClient().voteOnPost(post.id, VoteType.Upvote)}
      >
        <IconCaretUp />
      </ActionIcon>
      <Text size="lg" fw={500}>
        {totalRating}
      </Text>
      <ActionIcon
        variant="light"
        color={downvoteColor}
        w={40}
        onClick={() => new ApiClient().voteOnPost(post.id, VoteType.Downvote)}
      >
        <IconCaretDown />
      </ActionIcon>
    </Flex>
  );
}

export function PostRow({ post, full }: { post: PostDetailsDto | PostPreviewDto; full?: boolean }) {
  return (
    <Group wrap="nowrap" mb="lg" align="flex-start">
      <PostRating post={post} />
      <Stack style={{ overflow: "hidden" }} gap="xs">
        <Text
          size="xl"
          truncate={full ? undefined : "end"}
          className={full ? undefined : classNames["clamp-after-two-lines"]}
          component={Link}
          to={`/posts/${post.id}`}
        >
          {post.title}
        </Text>
        <Meta
          createdAt={new Date(post.createdAt)}
          member={post.member}
          commentCount={"comments" in post ? post.comments.length : post.commentCount}
        />
        <Text truncate={full ? undefined : "end"}>{post.content}</Text>
      </Stack>
    </Group>
  );
}
