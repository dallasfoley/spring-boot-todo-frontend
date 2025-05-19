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

export default function EditTodoForm({ id }: { id: string }) {
  const { currentUser } = useAppSelector((state) => state.user);
  const updateMutation = useUpdateTodo();
  const form = useForm({
    resolver: zodResolver(TodoSchema),
    defaultValues: {
      id: 0,
      userId: 0,
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
        userId: currentUser?.id,
      });
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Datetime..." {...field} />
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
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
