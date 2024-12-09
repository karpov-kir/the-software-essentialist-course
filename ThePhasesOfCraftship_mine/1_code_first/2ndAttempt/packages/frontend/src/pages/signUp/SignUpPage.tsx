import { SignUpDto, SignUpServerErrorReason } from "@dddforum/shared/dist/dtos/UserDto";
import { Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useAtom } from "jotai";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { Link, useNavigate } from "react-router";

import { ApiClient, ServerErrorResponse } from "../../ApiClient";
import { currentUserAtom } from "../../root/currentUserAtom";
import { SignUpForm } from "./SignUpForm";

export function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [, setCurrentUser] = useAtom(currentUserAtom);

  const handleFormSubmit = (signUpDto: SignUpDto) => {
    setIsLoading(true);

    const apiClient = new ApiClient();

    apiClient
      .signUp(signUpDto)
      .then(async ({ accessToken }) => {
        localStorage.setItem("accessToken", accessToken);
        setCurrentUser(await apiClient.me());
        navigate("/");
      })
      .catch((error) => {
        let message = "An error occurred, please try again later";

        if (
          error instanceof ServerErrorResponse &&
          error.serverError.reason === SignUpServerErrorReason.UserAlreadyExists
        ) {
          message = "Username or email already taken";
        }

        notifications.show({
          message,
          color: "red",
        });

        setIsLoading(false);
      });
  };

  return (
    <Fragment>
      <Title order={1} mb="lg">
        Sign up
      </Title>
      <SignUpForm mb="md" isLoading={isLoading} onSubmit={handleFormSubmit} />
      <Text ta="right">
        Already have an account?{" "}
        <Text component={Link} to="/sign-in" c="blue">
          Sign in!
        </Text>
      </Text>
    </Fragment>
  );
}
