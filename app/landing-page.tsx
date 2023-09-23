import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";

export function LandingPage() {
  return (
    <div className="p-4 py-24 flex flex-col items-center text-center max-w-2xl mx-auto">
      <h1 className="text-4xl mb-2 font-medium">
        Open Source Typeform Alternative
      </h1>
      <p className="text-lg mb-2">
        Openform is a free and open source alternative to Typeform. It is built
        with Next.js, Prisma, and Postgres.
      </p>

      <Button size="lg" asChild>
        <Link href="/login">Get Started</Link>
      </Button>
    </div>
  );
}
