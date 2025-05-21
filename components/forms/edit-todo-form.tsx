"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TodoSchema } from "@/schema/todo";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useUpdateTodo } from "@/hooks/useTodos";
import { Checkbox } from "../ui/checkbox";
import { useAppSelector } from "@/redux/hooks";
import { TimePickerDemo } from "../time-picker-demo";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function EditTodoForm({ id }: { id: string }) {
  const router = useRouter();
  const { currentUser } = useAppSelector((state) => state.user);
  const updateMutation = useUpdateTodo();
  const form = useForm({
    resolver: zodResolver(TodoSchema),
    defaultValues: {
      id: 0,
      userid: 0,
      name: "",
      datetime: new Date().toISOString(),
      completed: false,
    },
  });

  const onSubmit = async (formData: {
    name: string;
    datetime: string;
    completed: boolean;
  }) => {
    try {
      await updateMutation.mutateAsync({
        ...formData,
        id: Number(id),
        userid: currentUser?.id,
      });
      router.push("/todos");
    } catch (e) {
      console.error("Error: ", e);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name..." className="w-[280px]" {...field} />
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
                      selected={field.value ? new Date(field.value) : undefined}
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
        <FormField
          control={form.control}
          name="completed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Completed</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-[280px]">
          Submit
        </Button>
      </form>
    </Form>
  );
}
