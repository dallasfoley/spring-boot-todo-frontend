import { z } from "zod";

export const SignInSchema = z.object({
  username: z.string().min(8, "Username must be at least 8 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignIn = z.infer<typeof SignInSchema>;
