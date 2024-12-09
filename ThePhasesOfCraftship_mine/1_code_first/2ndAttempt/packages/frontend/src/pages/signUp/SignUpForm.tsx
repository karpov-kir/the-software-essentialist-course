import { SignUpDto } from "@dddforum/shared/dist/dtos/UserDto";
import { signUpDtoSchema } from "@dddforum/shared/dist/validationSchemas/signUpDtoSchema";
import { Box, Button, Flex, Grid, LoadingOverlay, MantineStyleProps, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAt } from "@tabler/icons-react";
import { zodResolver } from "mantine-form-zod-resolver";

import { removeEmptyStrings } from "../../utils/removeEmptyStrings";

const validator = zodResolver(signUpDtoSchema);

export function SignUpForm({
  isLoading,
  onSubmit,
  ...rest
}: MantineStyleProps & {
  isLoading: boolean;
  onSubmit: (signUpDto: SignUpDto) => void;
}) {
  const form = useForm({
    mode: "uncontrolled",
    validate: (values) => validator(removeEmptyStrings(values)),
  });

  return (
    <Box
      component="form"
      onSubmit={form.onSubmit((values) => onSubmit(signUpDtoSchema.parse(removeEmptyStrings(values))))}
      {...rest}
    >
      <LoadingOverlay visible={isLoading} />
      <Grid mb="xl" gutter="xl">
        <Grid.Col span={{ sm: 6 }}>
          <TextInput
            required={true}
            label="Email"
            leftSection={<IconAt size={16} />}
            placeholder="john.doe@gmail.com"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6 }}>
          <TextInput
            required={true}
            label="Username"
            placeholder="john.doe"
            key={form.key("username")}
            {...form.getInputProps("username")}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6 }}>
          <TextInput
            label="First name"
            placeholder="John"
            key={form.key("firstName")}
            {...form.getInputProps("firstName")}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6 }}>
          <TextInput
            label="Last name"
            placeholder="Doe"
            key={form.key("lastName")}
            {...form.getInputProps("lastName")}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6 }} offset={{ sm: 6 }}>
          <TextInput
            required={true}
            label="Password"
            type="password"
            key={form.key("password")}
            {...form.getInputProps("password")}
          />
        </Grid.Col>
      </Grid>

      <Flex justify="flex-end">
        <Button type="submit">Create account</Button>
      </Flex>
    </Box>
  );
}
