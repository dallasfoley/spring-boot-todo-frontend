"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todoApi } from "@/lib/api/api-client";
import { Todo } from "@/schema/todo";

export const todoKeys = {
  all: ["todos"] as const,
  lists: () => [...todoKeys.all, "list"] as const,
  list: (userId: number) => [...todoKeys.lists(), userId] as const,
  details: () => [...todoKeys.all, "detail"] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
};

export function useGetTodosByUserId(userId: number) {
  return useQuery({
    queryKey: todoKeys.list(userId),
    queryFn: () => todoApi.getTodosByUserId(userId),
    // Add staleTime: 0 to ensure the data is always refetched when needed
    staleTime: 0,
  });
}

export function useGetTodoById(id: number) {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => todoApi.getTodoById(id),
    enabled: !!id,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  console.log("useCreateTodo");
  return useMutation({
    mutationFn: (todo: Partial<Todo>) => todoApi.createTodo(todo),
    onSuccess: (data, variables) => {
      // Make sure to target the specific user's todo list
      if (variables.userId) {
        queryClient.invalidateQueries({
          queryKey: todoKeys.list(variables.userId as number),
        });
      }
      // Also invalidate all lists to be safe
      queryClient.invalidateQueries({
        queryKey: todoKeys.lists(),
      });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (todo: Partial<Todo>) => todoApi.updateTodo(todo),
    onSuccess: (data, variables) => {
      // Update the cache for this specific todo
      if (data.id) {
        queryClient.invalidateQueries({
          queryKey: todoKeys.detail(data.id),
        });
      }

      // Also invalidate the specific user's list
      if (data.userId) {
        queryClient.invalidateQueries({
          queryKey: todoKeys.list(data.userId),
        });
      }

      // Also invalidate all lists to be safe
      queryClient.invalidateQueries({
        queryKey: todoKeys.lists(),
      });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => todoApi.deleteTodo(id),
    onSuccess: (_, id) => {
      // Remove the todo from the cache
      queryClient.invalidateQueries({
        queryKey: todoKeys.detail(id),
      });

      // Also invalidate all list queries
      queryClient.invalidateQueries({
        queryKey: todoKeys.lists(),
      });
    },
  });
}
