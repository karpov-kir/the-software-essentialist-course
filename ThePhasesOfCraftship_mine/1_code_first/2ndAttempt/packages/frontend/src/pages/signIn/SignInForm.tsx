import { SignInDto } from "@dddforum/shared/dist/dtos/UserDto";
import { Box, Button, Flex, LoadingOverlay, MantineStyleProps, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export function SignInForm({
  isLoading,
  onSubmit,
  ...rest
}: MantineStyleProps & {
  isLoading: boolean;
  onSubmit: (signInDto: SignInDto) => void;
}) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      password: "",
    },
    // No need for validation here because the user is looked up in the database
  });

  return (
    <Box component="form" onSubmit={form.onSubmit((values) => onSubmit(values))} {...rest}>
      <LoadingOverlay visible={isLoading} />
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
