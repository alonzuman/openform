"use client";
import React from "react";
import { Button } from "~/components/ui/button";
import { signIn } from "next-auth/react";

export default function Page() {
  return (
    <>
      <Button
        onClick={() =>
          signIn("google", {
            callbackUrl: "/",
          })
        }
      >
        Sign in with Google
      </Button>
    </>
  );
}
