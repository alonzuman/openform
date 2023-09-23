import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { getServerUser } from "~/lib/auth";
import { nanoid } from "nanoid";
import { SubmitButton } from "./submit-button";
import { createForm, getForms } from "./[formId]/actions";
import { Header } from "~/components/header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { DropdownMenuItemSignOutButton } from "./sign-out-button";

export default async function Page() {
  const user = await getServerUser();
  return user ? (
    <Dashboard />
  ) : (
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

async function Dashboard() {
  const user = await getServerUser();
  if (!user?.id) {
    return null;
  }

  const forms = await getForms({
    userId: user.id,
  });

  return (
    <>
      <Header className="sticky top-0">
        <h1>Openform</h1>
        <div className="flex items-center gap-2">
          <form
            action={async (params: FormData) => {
              "use server";
              const newFormId = nanoid();
              await createForm({
                id: newFormId,
                userId: user.id,
                title: "Untitled Form",
              });

              redirect(`/${newFormId}/edit`);
            }}
          >
            <SubmitButton>Create new</SubmitButton>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar>
                  <AvatarImage src={user.image ?? ""} />
                  <AvatarFallback>
                    {user.name?.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItemSignOutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Header>
      <ul>
        {forms.map((form) => (
          <li key={form.id}>
            <Link href={`/${form.id}/edit`}>{form.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
