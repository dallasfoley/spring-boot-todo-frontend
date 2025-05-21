"use client";

import TodoComponent from "@/components/todo";
import { Button } from "@/components/ui/button";
import { useGetTodosByUserId } from "@/hooks/useTodos";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";

export default function TodoPage() {
  const { currentUser, isAuthenticated } = useAppSelector(
    (state) => state.user
  );

  const {
    data: todos,
    isLoading,
    error,
  } = currentUser?.id
    ? useGetTodosByUserId(currentUser.id)
    : { data: [], isLoading: false, error: null };

  console.log("User: ", currentUser);
  console.log("isAuthenticated: ", isAuthenticated);
  console.log("Todos: ", todos);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold">Todo List</h1>
      <p className="mt-2 text-gray-600">Welcome, {currentUser?.username}!</p>
      <p className="mt-2 mb-6 text-gray-600">Manage your tasks efficiently!</p>
      {isLoading && <p className="mt-4">Loading your todos...</p>}

      {error && (
        <div className="p-3 mt-4 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md w-full max-w-md">
          {error.message}
        </div>
      )}
      {!isLoading && !error && todos && todos.length === 0 && (
        <div className="p-3 mt-4 text-sm bg-yellow-50 border border-yellow-200 text-yellow-600 rounded-md w-full max-w-md">
          You don't have any todos yet. Click "Add Todo" to create one!
        </div>
      )}
      {todos && todos.length !== 0 && (
        <div className="space-y-2">
          {todos?.map((todo) => (
            <TodoComponent key={todo.id} todo={todo} />
          ))}
        </div>
      )}
      <Button asChild>
        <Link href="todos/add" className="m-4">
          Add Todo
        </Link>
      </Button>
    </div>
  );
}
