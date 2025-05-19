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
import { User, UserSchema } from "@/schema/user";
import { useSignUp } from "@/hooks/useUsers";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignUpForm() {
  const router = useRouter();
  const signUpMutation = useSignUp();
  const createUserMutation = useSignUp();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData: User) => {
    console.log("Here");
    try {
      console.log("Form errors:", form.formState.errors);
      setError(null);
      console.log("Submitting form data:", formData);

      const res1 = await signUpMutation.mutateAsync(formData);
      const res2 = await createUserMutation.mutateAsync(formData);
      console.log("Signup response:", res1);
      console.log("create user response:", res2);

      form.reset();
      router.push("/todos");
    } catch (e) {
      console.error("Error during signup:", e);
      setError(e instanceof Error ? e.message : "An unknown error occurred");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email..." type="email" {...field} />
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
                <Input placeholder="Password..." type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          // disabled={form.formState.isSubmitting || signUpMutation.isPending}
          className="w-full"
        >
          {signUpMutation.isPending ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
