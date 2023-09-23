import React from "react";
import { getForm, getFormSubmissions } from "../actions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Header } from "~/components/header";
import Link from "next/link";
import { Button } from "~/components/ui/button";

type Props = { params: { formId: string } };

export default async function Page(props: Props) {
  return (
    <>
      <Header className="sticky top-0">
        <Button asChild variant="ghost">
          <Link href="..">Back</Link>
        </Button>
      </Header>
      <AnalyticsTable formId={props.params.formId} />
    </>
  );
}

async function AnalyticsTable(props: { formId: string }) {
  const form = await getForm({
    id: props.formId,
  });
  const formSubmissions = await getFormSubmissions({
    formId: props.formId,
  });

  return (
    <Table>
      <TableCaption>A list of all of the form submissions</TableCaption>
      <TableHeader>
        <TableRow>
          {form?.fields?.map((field) => (
            <TableHead key={field.id}>{field.title}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {formSubmissions.map((submission) => (
          <TableRow key={submission.id}>
            {submission.submissionField.map((field) => (
              <TableCell key={field.fieldId}>{field.value}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
