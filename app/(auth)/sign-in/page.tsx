import SignInForm from "@/components/forms/sign-in-form";
import { Card } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <Card className="w-[350px] p-4">
      <SignInForm />
    </Card>
  );
}
