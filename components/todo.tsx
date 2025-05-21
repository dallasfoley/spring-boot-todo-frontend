"use client";

import { Todo } from "@/schema/todo";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useDeleteTodo, useUpdateTodo } from "@/hooks/useTodos";
import { useState } from "react";

export default function TodoComponent({ todo }: { todo: Todo }) {
  const router = useRouter();
  const updateMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const onUpdate = () => {
    router.push(`/todos/${todo.id}`);
  };

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTodoMutation.mutateAsync(todo.id);
      router.refresh();
    } catch (e) {
      console.error("Error: ", e);
      setError("Failed to delete todo. Please try again.");
    }
  };

  const onToggleCompleted = async () => {
    try {
      await updateMutation.mutateAsync({ ...todo, completed: !todo.completed });
    } catch (e) {
      console.error(e);
      setError("Failed to update todo. Please try again.");
    }
  };

  return (
    <Card className="aspect-square w-72 h-72">
      {error && (
        <div className="p-3 mt-4 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md w-full max-w-md">
          {error}
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{todo.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex flex-col items-center justify-around">
        <div className="flex flex-col items-center space-y-4 w-full">
          <span>{new Date(todo.datetime).toLocaleString()}</span>
          <div className="flex items-center space-x-2">
            <span className=" text-gray-500">Completed?</span>
            <Checkbox
              checked={todo.completed}
              onCheckedChange={onToggleCompleted}
              className="cursor-pointer"
            />
          </div>
        </div>
        <div className="flex space-x-2 md:space-x-4 mt-6">
          <Button className="cursor-pointer" onClick={onUpdate}>
            Edit
          </Button>
          <Button
            onClick={onDelete}
            disabled={isDeleting}
            className="cursor-pointer"
            variant="destructive"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
