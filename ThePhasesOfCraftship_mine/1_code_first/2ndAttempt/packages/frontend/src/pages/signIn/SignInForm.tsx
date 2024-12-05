import { SignInDto, SignInServerErrorReason } from "@dddforum/shared/dist/dtos/UserDto";
import { Box, Button, Flex, LoadingOverlay, MantineStyleProps, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useAtom } from "jotai";
import { useNavigate } from "react-router";

import { ApiClient, ServerErrorResponse } from "../../ApiClient";
import { currentUserAtom } from "../../root/currentUserAtom";

export function SignInForm(props: MantineStyleProps) {
  const [isLoadingOverlayVisible, loadingOverlayActions] = useDisclosure(false);
  const navigate = useNavigate();
  const [, setCurrentUser] = useAtom(currentUserAtom);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      password: "",
    },
    // No need for validation here because the user is looked up in the database
  });

  const handleFormSubmit = (signInDto: SignInDto) => {
    loadingOverlayActions.toggle();

    const apiClient = new ApiClient();

    apiClient
      .signIn(signInDto)
      .then(({ accessToken }) => {
        navigate("/");
        localStorage.setItem("accessToken", accessToken);
      })
      .then(async () => {
        const fetchedUser = await apiClient.me();
        setCurrentUser(fetchedUser);
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

        loadingOverlayActions.close();
      });
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(handleFormSubmit)} {...props}>
      <LoadingOverlay visible={isLoadingOverlayVisible} />
      <Stack mb="xl" gap="xl">
        <TextInput
          required={true}
          label="Username"
          placeholder="john.doe"
          key={form.key("username")}
          {...form.getInputProps("username")}
        />
        <TextInput
          required={true}
          label="Password"
          type="password"
          key={form.key("password")}
          {...form.getInputProps("password")}
        />
      </Stack>
      <Flex justify="flex-end">
        <Button type="submit">Sign in</Button>
      </Flex>
    </Box>
  );
}
