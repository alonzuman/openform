import { notFound, redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";
import { Form } from "../form";
import {
  FIELD_TYPES,
  createFormField,
  deleteFormField,
  getForm,
  updateForm,
  updateFormField,
  updateFormFieldArgs,
} from "../actions";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { SubmitButton } from "~/app/submit-button";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Header } from "~/components/header";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export default async function Page(props: {
  params: {
    formId: string;
  };
  searchParams: {
    fieldId: string;
  };
}) {
  const form = await getForm({
    id: props.params.formId,
  });

  if (!form) {
    throw notFound();
  }

  return (
    <>
      <EditLayout
        fieldId={props.searchParams.fieldId}
        formId={props.params.formId}
      >
        <Form fieldId={props.searchParams.fieldId} data={form} edit />
      </EditLayout>
    </>
  );
}

async function EditLayout(
  props: PropsWithChildren<{
    formId: string;
    fieldId?: string;
  }>
) {
  const formId = props.formId;
  const form = await getForm({
    id: formId,
  });
  const field = form?.fields?.find((field) => field.id === props.fieldId);

  if (!form) {
    throw notFound();
  }

  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <Button size="sm" asChild variant="ghost">
            <Link href="/">Openform</Link>
          </Button>
          <span>/</span>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost">
                {form.title || "Untitled Form"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Update Form Title</DialogTitle>
              <form
                action={async (formData: FormData) => {
                  "use server";
                  const title = formData.get("title");
                  if (typeof title !== "string") return;

                  await updateForm({
                    id: formId,
                    title,
                  });

                  revalidatePath(`/${formId}/edit`);
                }}
              >
                <Input
                  className="mb-2"
                  name="title"
                  defaultValue={form.title || ""}
                />
                <SubmitButton>Update</SubmitButton>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" asChild variant="ghost">
            <Link href={`/${formId}/analytics`}>Analytics</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={`/${formId}`}>Preview</Link>
          </Button>
        </div>
      </Header>
      <aside className="fixed left-0 top-16 p-4 bottom-0 w-56 h-[calc(100dvh_-_4rem)]">
        <ul className="flex flex-col gap-2">
          {form.fields?.map((field) => {
            const selected = field.id === props.fieldId;
            return (
              <li key={field.id}>
                <Button asChild variant={selected ? "outline" : "ghost"}>
                  <Link
                    key={field.id}
                    href={`/${formId}/edit?fieldId=${field.id}`}
                    scroll={false}
                  >
                    {field.title || "Untitled Field"}
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
        <form
          className="mt-2"
          action={async () => {
            "use server";
            const newFormFieldId = nanoid();

            await createFormField({
              formId: formId,
              id: newFormFieldId,
              type: "text",
              title: "New Field",
              required: false,
            });

            revalidatePath(`/${formId}/edit`);
            redirect(`/${formId}/edit?fieldId=${newFormFieldId}`);
          }}
        >
          <SubmitButton variant="ghost">Create Field</SubmitButton>
        </form>
      </aside>
      {props.children}

      <aside className="fixed right-0 top-16 p-4 bottom-0 w-56 h-[calc(100dvh_-_4rem)]">
        {props.fieldId && (
          <form
            className="flex flex-col gap-2"
            key={props.fieldId}
            action={async (formData: FormData) => {
              "use server";

              const title = formData.get("title");
              const required = formData.get("required");
              const type = formData.get("type");
              const id = props.fieldId;
              const order = formData.get("order");

              const parsed = updateFormFieldArgs.parse({
                id,
                formId,
                title,
                required: required === "on",
                type,
                order,
              });

              await updateFormField(parsed);

              revalidatePath(`/${formId}/edit?fieldId=${id}`);
            }}
          >
            <input hidden name="id" defaultValue={field?.id || ""} />
            <input hidden name="formId" defaultValue={form.id} />
            <Input
              name="title"
              placeholder="Field title"
              defaultValue={field?.title || ""}
            />

            <Select name="type" defaultValue={field?.type || "text"}>
              <SelectTrigger className="text-md">
                <SelectValue placeholder="Field Type" />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center py-2 gap-2">
              <Checkbox
                name="required"
                defaultChecked={field?.required || false}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Required
              </label>
            </div>

            <SubmitButton>Update Field</SubmitButton>
            <SubmitButton
              variant="destructive"
              formAction={async () => {
                "use server";
                await deleteFormField({
                  id: field?.id || "",
                });

                revalidatePath(`/${formId}/edit`);
                redirect(`/${formId}/edit`);
              }}
            >
              Delete Field
            </SubmitButton>
          </form>
        )}
      </aside>
    </>
  );
}
