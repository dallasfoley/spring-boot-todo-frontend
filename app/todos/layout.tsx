import type React from "react";
import AuthGuard from "@/components/auth-guard";

export default function TodosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen w-full flex flex-col justify-center items-center">
        {children}
      </div>
    </AuthGuard>
  );
}
