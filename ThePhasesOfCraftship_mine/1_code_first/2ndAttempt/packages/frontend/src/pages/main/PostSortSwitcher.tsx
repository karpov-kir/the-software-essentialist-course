import { PostFilter } from "@dddforum/shared/dist/dtos/PostDto";
import { rem, Tabs, Text } from "@mantine/core";
import { IconClearAll, IconFlame, IconRecharging } from "@tabler/icons-react";

export function PostFilterSwitcher({
  filter,
  onChange,
}: {
  filter: PostFilter;
  onChange: (filter: PostFilter) => void;
}) {
  const iconStyle = { width: rem(20), height: rem(20) };

  return (
    <Tabs defaultValue="popular" mb="lg" value={filter} onChange={(value) => onChange(value as PostFilter)}>
      <Tabs.List>
        <Tabs.Tab value="popular" leftSection={<IconFlame style={iconStyle} />}>
          <Text size="xl">Popular</Text>
        </Tabs.Tab>
        <Tabs.Tab value="new" leftSection={<IconRecharging style={iconStyle} />}>
          <Text size="xl">New</Text>
        </Tabs.Tab>
        <Tabs.Tab value="all" leftSection={<IconClearAll style={iconStyle} />}>
          <Text size="xl">All</Text>
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}
