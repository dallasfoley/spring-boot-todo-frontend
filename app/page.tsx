import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-w-full min-h-screen flex items-center justify-center">
      <Card className="w-96 h-96">
        <CardContent className="flex flex-col items-center justify-around h-full">
          <Button className="bg-blue-700" asChild>
            <Link href="/sign-in">
              <h5>Sign-In</h5>
            </Link>
          </Button>
          <Button className="bg-green-600" asChild>
            <Link href="/sign-up">
              <h5>Sign-Up</h5>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
