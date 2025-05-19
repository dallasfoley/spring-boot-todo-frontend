import { z } from "zod";

export const TodoSchema = z.object({
  id: z.number(),
  userId: z.number(),
  name: z.string(),
  datetime: z.string().datetime(),
  completed: z.boolean().default(false),
});

export type Todo = z.infer<typeof TodoSchema>;
