import { notFound } from "next/navigation";
import React from "react";
import { Form } from "./form";
import { getForm } from "./actions";

export default async function Page(props: {
  params: {
    formId: string;
  };
  searchParams: {
    fieldId: string;
  };
}) {
  const form = await getForm({ id: props.params.formId });

  if (!form) {
    throw notFound();
  }

  return <Form data={form} fieldId={props.searchParams.fieldId} />;
}
