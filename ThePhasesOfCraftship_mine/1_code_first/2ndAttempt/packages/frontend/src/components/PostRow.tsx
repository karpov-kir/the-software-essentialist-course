import { PostDetailsDto, PostPreviewDto } from "@dddforum/shared/dist/dtos/PostDto";
import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";
import { ActionIcon, Flex, Group, Stack, Text } from "@mantine/core";
import { IconCaretDown, IconCaretUp } from "@tabler/icons-react";
import { Link } from "react-router";

import { Meta } from "./Meta";
import classNames from "./PostRow.module.css";

function PostRating({
  post,
  onVote,
}: {
  post: PostDetailsDto | PostPreviewDto;
  onVote: (postId: number, voteType: VoteType, action: "add" | "remove") => void;
}) {
  let postCommentsRating;

  if ("comments" in post) {
    postCommentsRating = post.comments.reduce((rating, comment) => {
      const commentVotesRating = comment.upvoteCount - comment.downvoteCount;
      return rating + commentVotesRating;
    }, 0);
  } else {
    postCommentsRating = post.commentsUpvoteCount - post.commentsDownvoteCount;
  }

  const postVotesRating = post.upvoteCount - post.downvoteCount;
  const totalRating = postVotesRating + postCommentsRating;

  const upvoteColor = post.currentMemberVoteType === VoteType.Upvote ? "green" : undefined;
  const downvoteColor = post.currentMemberVoteType === VoteType.Downvote ? "red" : undefined;

  const handleVote = (voteType: VoteType) => {
    const action = post.currentMemberVoteType === voteType ? "remove" : "add";
    onVote(post.id, voteType, action);
  };

  return (
    <Flex direction="column" align="center">
      <ActionIcon variant="light" color={upvoteColor} w={40} onClick={() => handleVote(VoteType.Upvote)}>
        <IconCaretUp />
      </ActionIcon>
      <Text size="lg" fw={500}>
        {totalRating}
      </Text>
      <ActionIcon variant="light" color={downvoteColor} w={40} onClick={() => handleVote(VoteType.Downvote)}>
        <IconCaretDown />
      </ActionIcon>
    </Flex>
  );
}

export function PostRow({
  post,
  full,
  onVote,
}: {
  post: PostDetailsDto | PostPreviewDto;
  full?: boolean;
  onVote: (postId: number, voteType: VoteType, action: "add" | "remove") => void;
}) {
  return (
    <Group wrap="nowrap" mb="lg" align="flex-start">
      <PostRating post={post} onVote={onVote} />
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
        <Text truncate={full ? undefined : "end"} className={full ? undefined : classNames["clamp-after-two-lines"]}>
          {post.content}
        </Text>
      </Stack>
    </Group>
  );
}
