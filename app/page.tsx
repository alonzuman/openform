import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { getServerUser } from "~/lib/auth";
import { nanoid } from "nanoid";
import { SubmitButton } from "./submit-button";
import { createForm } from "./[formId]/actions";
import { Header } from "~/components/header";

export default async function Page() {
  const user = await getServerUser();
  return user ? (
    <Dashboard />
  ) : (
    <div>
      <h1>Open Source Typeform Alternative</h1>

      <Button asChild>
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

  const forms = await prisma.form.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <>
      <Header className="sticky top-0">
        <h1>Openform</h1>
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
