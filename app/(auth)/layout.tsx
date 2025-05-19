import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" min-w-full min-h-screen flex items-center justify-center bg-zinc-300">
      {children}
    </div>
  );
}
