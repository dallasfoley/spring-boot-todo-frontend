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
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { TodoNoIdSchema, TodoSchema } from "@/schema/todo";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { setDate } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns";
import { TimePickerDemo } from "@/components/time-picker-demo";

export default function AddTodoPage() {
  const router = useRouter();
  const { currentUser } = useAppSelector((state) => state.user);
  const createTodoMutation = useCreateTodo();
  const form = useForm({
    resolver: zodResolver(TodoNoIdSchema),
    defaultValues: {
      userid: 0,
      name: "",
      datetime: new Date(),
      completed: false,
    },
  });

  const onSubmit = async (formData: {
    userid: number;
    name: string;
    datetime: Date;
    completed: boolean;
  }) => {
    try {
      const todoData = {
        ...formData,
        userid: currentUser?.id,
        completed: false,
        datetime: formData.datetime.toISOString(),
      };
      console.log("todoData: ", todoData);
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
                <FormLabel>Date</FormLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !field && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <FormControl>
                      <Calendar
                        className="bg-white border-1 rounded-md shadow-sm"
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </FormControl>
                  </PopoverContent>
                </Popover>
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
                  <TimePickerDemo date={new Date()} setDate={field.onChange} />
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
