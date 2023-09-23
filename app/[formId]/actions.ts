import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "~/lib/prisma";

export const FIELD_TYPES = [
  {
    label: "Text",
    value: "text",
  },
  {
    label: "Text Area",
    value: "textarea",
  },
  {
    label: "Select",
    value: "select",
  },
  {
    label: "Checkbox",
    value: "checkbox",
  },
  {
    label: "Radio",
    value: "radio",
  },
];

export const formFieldType = z.enum([
  "text",
  "textarea",
  "select",
  "checkbox",
  "radio",
]);

export async function getForm(args: z.infer<typeof getFormArgs>) {
  const data = await prisma.form.findUnique({
    where: {
      id: args.id,
    },
    include: {
      fields: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  return getFormOutput.parse(data);
}

export const getFormOutput = z.object({
  id: z.string(),
  title: z.string(),
  userId: z.string(),
  fields: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      type: formFieldType,
      required: z.boolean(),
      order: z.number(),
    })
  ),
});

export const getFormArgs = z.object({
  id: z.string(),
});

export type GetForm = Awaited<ReturnType<typeof getForm>>;

export async function getForms(args: z.infer<typeof getFormsArgs>) {
  return prisma.form.findMany({
    where: {
      userId: args.userId,
    },
  });
}

export const getFormsArgs = z.object({
  userId: z.string(),
});

export async function createForm(args: z.infer<typeof createFormArgs>) {
  return prisma.form.create({
    data: {
      ...args,
      fields: {
        create: {
          title: "First Question",
          order: 0,
          required: false,
          type: "text",
        },
      },
    },
  });
}

export const createFormArgs = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
});

export async function updateForm(args: z.infer<typeof updateFormArgs>) {
  return prisma.form.update({
    where: {
      id: args.id,
    },
    data: args,
  });
}

export const updateFormArgs = z.object({
  id: z.string(),
  title: z.string(),
});

export async function deleteForm(args: z.infer<typeof deleteFormArgs>) {
  return prisma.form.delete({
    where: {
      id: args.id,
    },
  });
}

export const deleteFormArgs = z.object({
  id: z.string(),
});

export async function createFormField(
  args: z.infer<typeof createFormFieldArgs>
) {
  const form = await getForm({
    id: args.formId,
  });

  return prisma.field.create({
    data: {
      ...args,
      order: form?.fields.length || 0,
    },
  });
}

export const createFormFieldArgs = z.object({
  id: z.string(),
  formId: z.string(),
  title: z.string(),
  type: formFieldType,
  required: z.boolean(),
});

export async function updateFormField(
  args: z.infer<typeof updateFormFieldArgs>
) {
  return prisma.field.update({
    where: {
      id: args.id,
    },
    data: args,
  });
}

export const updateFormFieldArgs = z.object({
  id: z.string(),
  title: z.string(),
  type: formFieldType,
  required: z.boolean(),
});

export async function deleteFormField(
  args: z.infer<typeof deleteFormFieldArgs>
) {
  return prisma.field.delete({
    where: {
      id: args.id,
    },
  });
}

export const deleteFormFieldArgs = z.object({
  id: z.string(),
});

export async function createFormSubmission(
  args: z.infer<typeof createFormSubmissionArgs>
) {
  return prisma.submission.create({
    data: args,
    include: {
      submissionField: true,
    },
  });
}

export const createFormSubmissionArgs = z.object({
  anonymousId: z.string(),
  formId: z.string(),
});

export async function upsertSubmissionField(
  args: z.infer<typeof upsertFormFieldSubmissionArgs>
) {
  return prisma.submissionField.upsert({
    where: {
      submissionId_fieldId_anonymousId: {
        anonymousId: args.anonymousId,
        fieldId: args.fieldId,
        submissionId: args.submissionId,
      },
    },
    create: args,
    update: args,
  });
}

export const upsertFormFieldSubmissionArgs = z.object({
  submissionId: z.string(),
  fieldId: z.string(),
  anonymousId: z.string(),
  value: z.string(),
});

export async function getFormSubmissions(
  args: z.infer<typeof getFormSubmissionsArgs>
) {
  return prisma.submission.findMany({
    where: {
      formId: args.formId,
    },
    include: {
      submissionField: true,
    },
  });
}

export const getFormSubmissionsArgs = z.object({
  formId: z.string(),
});

export async function getFormSubmission(
  args: z.infer<typeof getFormSubmissionArgs>
) {
  return prisma.submission.findUnique({
    where: {
      id: args.id,
    },
  });
}

export const getFormSubmissionArgs = z.object({
  id: z.string(),
});

export async function getSubmissionByUserId(
  args: z.infer<typeof getSubmissionByUserIdArgs>
) {
  return prisma.submission.findFirst({
    where: {
      anonymousId: args.anonymousId,
    },
    include: {
      submissionField: true,
    },
  });
}

const getSubmissionByUserIdArgs = z.object({
  anonymousId: z.string(),
});

export async function setAnonymousId() {
  const newId = nanoid();

  cookies().set("openform_id", newId, {
    secure: true,
  });
}

export async function getAnonymousId() {
  return cookies().get("openform_id");
}
