"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@/hooks/useUsers";
import { Button } from "../ui/button";
import { SignIn, SignInSchema } from "@/schema/sign-in";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/slices/userSlice";

export default function SignInForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const signInMutation = useSignIn();
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (formData: { username: string; password: string }) => {
    try {
      setError("");
      const result = await signInMutation.mutateAsync(formData);
      console.log("Sign-in result:", result);

      // Show success toast
      toast("You have been signed in successfully");
      dispatch(setUser(result));

      // Redirect to dashboard or home page
      router.push("/todos");
    } catch (e: any) {
      console.error("Error: ", e);
      setError(
        e?.message || "Failed to sign in. Please check your credentials."
      );

      // Show error toast
      toast("Failed to sign in. Please check your credentials.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={signInMutation.isPending}
        >
          {signInMutation.isPending ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}
