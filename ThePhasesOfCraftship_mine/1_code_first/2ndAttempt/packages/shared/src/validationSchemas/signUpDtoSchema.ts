import z from "zod";

import { passwordSchema } from "./passwordSchema";

export const signUpDtoSchema = z.object({
  username: z.string().min(1).max(30).trim(),
  email: z.string().email().trim(),
  firstName: z.string().min(1).max(30).trim().optional(),
  lastName: z.string().min(1).max(30).trim().optional(),
  password: passwordSchema,
});
