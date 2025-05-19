"use client";

import TodoComponent from "@/components/todo";
import { Button } from "@/components/ui/button";
import { useGetTodosByUserId } from "@/hooks/useTodos";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TodoPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAppSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      router.push("/sign-up");
    }
  }, [isAuthenticated, currentUser, router]);

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  const {
    data: todos,
    isLoading,
    error,
  } = currentUser?.id
    ? useGetTodosByUserId(currentUser.id)
    : { data: [], isLoading: false, error: null };

  console.log("User: ", currentUser);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold">Todo List</h1>
      <p className="mt-2 text-gray-600">Welcome, {currentUser?.username}!</p>
      <p className="mt-2 text-gray-600">Manage your tasks efficiently!</p>
      {isLoading && <p className="mt-4">Loading your todos...</p>}

      {error && (
        <div className="p-3 mt-4 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md w-full max-w-md">
          {error.message}
        </div>
      )}

      {!isLoading && !error && (
        <div className="mt-6 w-full max-w-md">
          {todos?.length === 0 ? (
            <p className="text-center text-gray-500">
              You don't have any todos yet.
            </p>
          ) : (
            <div className="space-y-2">
              {todos?.map((todo) => (
                <TodoComponent key={todo.id} todo={todo} />
              ))}
            </div>
          )}
          <Button asChild>
            <Link href="todos/add" className="m-4 w-full">
              Add Todo
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
