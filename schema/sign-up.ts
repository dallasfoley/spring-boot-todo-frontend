import { z } from "zod";

export const SignUpSchema = z.object({
  username: z.string().min(8, "Username must be at least 8 characters"),
  email: z.string().email("Must be valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignUp = z.infer<typeof SignUpSchema>;
