import { Box } from "@mantine/core";
import { forwardRef } from "react";
import ReactGravatar from "react-gravatar";

export const Gravatar = forwardRef<HTMLDivElement, { email: string; size?: number }>(function Gravatar(
  { email, size },
  ref,
) {
  return (
    <Box
      ref={ref}
      style={{
        borderRadius: "50%",
        overflow: "hidden",
      }}
      w={size}
      h={size}
    >
      <ReactGravatar email={email} size={size} />
    </Box>
  );
});
