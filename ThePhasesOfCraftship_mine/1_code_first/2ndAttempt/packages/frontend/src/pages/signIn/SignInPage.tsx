import { SignInDto, SignInServerErrorReason } from "@dddforum/shared/dist/dtos/UserDto";
import { Box, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useAtom } from "jotai";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { ApiClient, ServerErrorResponse } from "../../ApiClient";
import { currentUserAtom } from "../../root/currentUserAtom";
import { SignInForm } from "./SignInForm";

export function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [, setCurrentUser] = useAtom(currentUserAtom);

  const handleFormSubmit = (signInDto: SignInDto) => {
    setIsLoading(true);

    const apiClient = new ApiClient();

    apiClient
      .signIn(signInDto)
      .then(async ({ accessToken }) => {
        localStorage.setItem("accessToken", accessToken);
        setCurrentUser(await apiClient.me());
        navigate("/");
      })
      .catch((error) => {
        let message = "An error occurred, please try again later";

        if (error instanceof ServerErrorResponse) {
          if (error.serverError.reason === SignInServerErrorReason.UserNotFound) {
            message = "User not found";
          } else if (error.serverError.reason === SignInServerErrorReason.InvalidPassword) {
            message = "Invalid password";
          }
        }

        notifications.show({
          message,
          color: "red",
        });

        setIsLoading(false);
      });
  };

  return (
    <Box maw={500} m="auto">
      <Title order={1} mb="lg">
        Sign in
      </Title>
      <SignInForm mb="md" isLoading={isLoading} onSubmit={handleFormSubmit} />
      <Text ta="right">
        Don&apos;t have an account?{" "}
        <Text component={Link} to="/sign-up" c="blue">
          Sign up!
        </Text>
      </Text>
    </Box>
  );
}
