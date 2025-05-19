"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/api/api-client";
import type { User } from "@/schema/user";

// Query keys for better cache management
export const userKeys = {
  all: ["users"] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  byUsername: (username: string) =>
    [...userKeys.all, "byUsername", username] as const,
};

export function useGetUserByUsername(username: string) {
  return useQuery({
    queryKey: userKeys.byUsername(username),
    queryFn: () => userApi.getUserByUsername(username),
    enabled: !!username,
  });
}

// Hook to create a new user
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: User) => userApi.createUser(user),
    onSuccess: () => {
      // Invalidate relevant queries after creating a user
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

// Hook to update a user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: User) => userApi.updateUser(user),
    onSuccess: (data) => {
      // Update the cache for this specific user
      // queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) });
      // Also invalidate the general users queries
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

// Hook to delete a user
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userApi.deleteUser(id),
    onSuccess: (_, id) => {
      // Remove the user from the cache
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      // Also invalidate the general users queries
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

// Hook for user sign in
export function useSignIn() {
  return useMutation({
    mutationFn: (credentials: Partial<User>) => userApi.signIn(credentials),
  });
}

// Hook for user sign up
export function useSignUp() {
  return useMutation({
    mutationFn: (user: User) => userApi.signUp(user),
  });
}
