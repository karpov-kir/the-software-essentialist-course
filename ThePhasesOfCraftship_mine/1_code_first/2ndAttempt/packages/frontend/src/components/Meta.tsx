import { MemberDto } from "@dddforum/shared/dist/dtos/MemberDto";
import { Group, Text } from "@mantine/core";
import { formatDistance } from "date-fns";

import { Gravatar } from "./Gravatar";

export function Meta({
  member,
  commentCount,
  createdAt,
}: {
  createdAt: Date;
  member: MemberDto;
  commentCount?: number;
}) {
  return (
    <Group gap="xs" wrap="nowrap">
      <Text size="sm" style={{ whiteSpace: "nowrap" }}>
        {formatDistance(createdAt, new Date(), { addSuffix: true })}
      </Text>
      <Gravatar size={20} email={member.user.email} />
      <Text size="sm" truncate="end" miw={15}>
        {member.user.username}
      </Text>
      {commentCount !== undefined && (
        <Text size="sm" style={{ whiteSpace: "nowrap" }}>
          {commentCount} comments
        </Text>
      )}
    </Group>
  );
}
