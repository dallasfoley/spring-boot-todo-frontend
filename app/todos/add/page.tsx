"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateTodo } from "@/hooks/useTodos";
import { useAppSelector } from "@/redux/hooks";
import { TodoSchema } from "@/schema/todo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function AddTodoPage() {
  const router = useRouter();
  const { currentUser } = useAppSelector((state) => state.user);
  const createTodoMutation = useCreateTodo();
  const form = useForm({
    resolver: zodResolver(TodoSchema),
    defaultValues: {
      id: 0,
      userId: 0,
      name: "",
      datetime: new Date().toISOString(),
      completed: false,
    },
  });

  const onSubmit = async (formData: { name: string; datetime: string }) => {
    try {
      const todoData = {
        ...formData,
        completed: false,
        userId: currentUser?.id,
      };
      await createTodoMutation.mutateAsync(todoData);
      toast.success("Todo created successfully!");
      router.push("/todos");
    } catch (e) {
      console.error("Error: ", e);
      toast.error("Failed to create todo. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md p-6 mx-auto mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task</FormLabel>
                <FormControl>
                  <Input placeholder="Name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="datetime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input placeholder="Datetime..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={createTodoMutation.isPending}
          >
            {createTodoMutation.isPending ? "Creating..." : "Add Todo"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
