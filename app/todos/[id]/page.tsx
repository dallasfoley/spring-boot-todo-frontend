import EditTodoForm from "@/components/forms/edit-todo-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TodoPage(
  params: Promise<{ params: { id: string } }>
) {
  const { id } = (await params).params;

  return (
    <Card>
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent>
        <EditTodoForm id={id} />
      </CardContent>
    </Card>
  );
}
