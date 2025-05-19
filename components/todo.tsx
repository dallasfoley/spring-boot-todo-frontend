"use client";

import { Todo } from "@/schema/todo";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useDeleteTodo, useUpdateTodo } from "@/hooks/useTodos";

export default function TodoComponent({ todo }: { todo: Todo }) {
  const router = useRouter();
  const updateMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();
  const onUpdate = () => {
    router.push(`/todos/${todo.id}`);
  };

  const onDelete = async () => {
    try {
      await deleteTodoMutation.mutateAsync(todo.id);
      router.refresh();
    } catch (e) {
      console.error("Error: ", e);
    }
  };

  const onToggleCompleted = async () => {
    try {
      await updateMutation.mutateAsync({ ...todo, completed: !todo.completed });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{todo.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <span>{todo.datetime}</span>
        <Checkbox
          checked={todo.completed}
          onCheckedChange={onToggleCompleted}
        />
        <Button onClick={onUpdate}>Edit</Button>
        <Button onClick={onDelete} variant="destructive">
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}
