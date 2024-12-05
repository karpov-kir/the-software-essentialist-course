import { Text, Title } from "@mantine/core";
import { Fragment } from "react/jsx-runtime";
import { Link } from "react-router";

import { SignUpForm } from "./SignUpForm";

export function SignUpPage() {
  return (
    <Fragment>
      <Title order={1} mb="lg">
        Sign up
      </Title>
      <SignUpForm mb="md" />
      <Text ta="right">
        Already have an account?{" "}
        <Text component={Link} to="/sign-in" c="blue">
          Sign in!
        </Text>
      </Text>
    </Fragment>
  );
}
