import SignUpForm from "@/components/forms/sign-up-form";
import { Card } from "@/components/ui/card";

export default function SignUp() {
  return (
    <Card className="w-[350px] p-4">
      <SignUpForm />
    </Card>
  );
}
