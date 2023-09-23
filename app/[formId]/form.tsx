import React from "react";
import {
  GetForm,
  createFormSubmission,
  getAnonymousId,
  getSubmissionByUserId,
  setAnonymousId,
  upsertSubmissionField,
} from "./actions";
import { Input } from "~/components/ui/input";
import { SubmitButton } from "../submit-button";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { FormFooter } from "./form-footer";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { FieldWrapper } from "./field-wrapper";
import { Textarea } from "~/components/ui/textarea";

export async function Form(props: {
  data: GetForm;
  edit?: boolean;
  fieldId: string;
}) {
  const isEditing = props.edit;
  const anonymousId = await getAnonymousId();
  const anonymousIdValue = anonymousId?.value;
  const submission = anonymousIdValue
    ? await getSubmissionByUserId({
        anonymousId: anonymousIdValue,
      })
    : null;

  const shouldShowStartScreen = !anonymousIdValue && !isEditing;
  const shouldShowFinishScreen =
    submission?.submissionField?.length === props?.data?.fields?.length &&
    !isEditing;

  const nextFieldIndex =
    (props?.data?.fields || [])?.findIndex(
      (field) => field.id === props?.fieldId
    ) + 1;
  const previousFieldIndex =
    (props?.data?.fields || [])?.findIndex(
      (field) => field.id === props?.fieldId
    ) - 1;

  const nextFieldId = props?.data?.fields?.[nextFieldIndex]?.id;
  const previousFieldId = props?.data?.fields?.[previousFieldIndex]?.id;

  if (shouldShowStartScreen) {
    return (
      <div className="h-full">
        <form
          action={async () => {
            "use server";
            await setAnonymousId();
          }}
          className="h-full text-xl font-medium text-center py-24 flex flex-col gap-2 items-center"
        >
          <h1 className="text-2xl font-medium">Welcome Screen</h1>
          <SubmitButton>
            Start Survey
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </SubmitButton>
        </form>
      </div>
    );
  }

  if (shouldShowFinishScreen) {
    return (
      <div className="h-full text-xl font-medium text-center py-24 flex flex-col gap-2 items-center">
        <h1 className="text-2xl font-medium">
          Thank you for completing the survey!
        </h1>
        <Button asChild>
          <Link href="/">
            Create your own <ArrowRightIcon className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {props?.data?.fields?.map((field, fieldIndex) => {
        const isActiveField =
          props.fieldId === field?.id || (!props.fieldId && fieldIndex === 0);

        const currentValue = submission?.submissionField?.find(
          (submissionField) => submissionField.fieldId === field.id
        )?.value;

        return (
          <FieldWrapper fieldId={field.id} key={field.id}>
            <form
              className="flex flex-col items-start gap-2"
              action={async (formData: FormData) => {
                "use server";
                if (!props?.data?.id) return;
                if (isEditing) return;

                const value = formData.get(field.id);

                if (field.required && !value) {
                  // TODO throw an error
                  return;
                }

                let submission = await getSubmissionByUserId({
                  anonymousId: anonymousId?.value as string,
                });

                if (!submission) {
                  submission = await createFormSubmission({
                    formId: props.data?.id,
                    anonymousId: anonymousId?.value as string,
                  });
                }

                await upsertSubmissionField({
                  submissionId: submission.id,
                  fieldId: field.id,
                  value: value as string,
                  anonymousId: anonymousId?.value as string,
                });

                const nextField = props?.data?.fields?.[fieldIndex + 1];

                if (nextField) {
                  revalidatePath(`/${props.data.id}`);
                  redirect(`/${props.data.id}?fieldId=${nextField?.id}`);
                } else {
                  revalidatePath(`/${props.data.id}`);
                }
              }}
            >
              <h4>{fieldIndex + 1}</h4>
              <h1 className="text-lg mb-4">{field.title}</h1>
              {field.type === "text" && (
                <Input
                  defaultValue={currentValue}
                  required={field.required}
                  autoFocus={isActiveField}
                  type="text"
                  name={field.id}
                  variant="underline"
                  placeholder="Type your answer here..."
                  size="lg"
                />
              )}
              {field.type === "textarea" && (
                <Textarea
                  defaultValue={currentValue}
                  required={field.required}
                  autoFocus={isActiveField}
                  name={field.id}
                  variant="underline"
                  placeholder="Type your answer here..."
                  size="lg"
                />
              )}
              <SubmitButton size="lg">
                OK <CheckIcon className="h-4 w-4 ml-2" />
              </SubmitButton>
            </form>
          </FieldWrapper>
        );
      })}
      {!isEditing && (
        <FormFooter
          nextFieldId={nextFieldId}
          previousFieldId={previousFieldId}
        />
      )}
    </>
  );
}
