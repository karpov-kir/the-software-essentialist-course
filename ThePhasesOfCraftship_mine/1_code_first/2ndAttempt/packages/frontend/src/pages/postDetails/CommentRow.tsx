import { CommentDto } from "@dddforum/shared/dist/dtos/CommentDto";
import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";
import { ActionIcon, Box, Group, Text } from "@mantine/core";
import { IconCaretDown, IconCaretUp } from "@tabler/icons-react";

import { Meta } from "../../components/Meta";

function CommentRating({
  comment,
  onVote,
}: {
  comment: CommentDto;
  onVote: (commentId: number, voteType: VoteType, action: "add" | "remove") => void;
}) {
  const upvoteColor = comment.currentMemberVoteType === VoteType.Upvote ? "green" : undefined;
  const downvoteColor = comment.currentMemberVoteType === VoteType.Downvote ? "red" : undefined;
  const rating = comment.upvoteCount - comment.downvoteCount;

  const handleVote = (voteType: VoteType) => {
    const action = comment.currentMemberVoteType === voteType ? "remove" : "add";
    onVote(comment.id, voteType, action);
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

export function CommentRow({
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
