import EditTodoForm from "@/components/forms/edit-todo-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TodoPage(
  params: Promise<{ params: { id: string } }>
) {
  const { id } = await (await params).params;

  return (
    <Card className="m-4 w-[330px]">
      <CardHeader>
        <CardTitle>Edit Your Todo</CardTitle>
      </CardHeader>
      <CardContent>
        <EditTodoForm id={id} />
      </CardContent>
    </Card>
  );
}
