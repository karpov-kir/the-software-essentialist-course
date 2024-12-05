import { Box, Text, Title } from "@mantine/core";
import { Link } from "react-router";

import { SignInForm } from "./SignInForm";

export function SignInPage() {
  return (
    <Box maw={500} m="auto">
      <Title order={1} mb="lg">
        Sign in
      </Title>
      <SignInForm mb="md" />
      <Text ta="right">
        Don&apos;t have an account?{" "}
        <Text component={Link} to="/sign-up" c="blue">
          Sign up!
        </Text>
      </Text>
    </Box>
  );
}
