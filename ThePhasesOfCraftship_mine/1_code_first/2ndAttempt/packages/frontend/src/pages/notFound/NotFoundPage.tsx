import { Text, Title } from "@mantine/core";
import { Fragment } from "react/jsx-runtime";
import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <Fragment>
      <Title>404</Title>
      <p>
        Oops! The page you are looking for does not exist. You can go back to the{" "}
        <Text c="blue" component={Link} to="/">
          main page
        </Text>
        .
      </p>
    </Fragment>
  );
}
