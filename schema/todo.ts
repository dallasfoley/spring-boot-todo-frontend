import { z } from "zod";

export const TodoNoIdSchema = z.object({
  userid: z.number(),
  name: z.string(),
  datetime: z.date(),
  completed: z.boolean().default(false),
});

export type TodoNoId = z.infer<typeof TodoNoIdSchema>;

export const TodoSchema = z.object({
  id: z.number(),
  userid: z.number(),
  name: z.string(),
  datetime: z.string().datetime(),
  completed: z.boolean().default(false),
});

export type Todo = z.infer<typeof TodoSchema>;
