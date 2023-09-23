"use client";
import React from "react";
import { Button } from "~/components/ui/button";
import { signIn } from "next-auth/react";

export default function Page() {
  return (
    <div className="py-24 max-w-xl mx-auto w-full flex flex-col gap-2">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <Button
        variant="outline"
        onClick={() =>
          signIn("google", {
            callbackUrl: "/",
          })
        }
      >
        Sign in with Google
      </Button>
    </div>
  );
}
