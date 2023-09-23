"use client";

import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { Button, ButtonProps } from "~/components/ui/button";

export function SubmitButton(props: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} {...props}>
      {pending ? "Loading..." : props.children || "Submit"}
    </Button>
  );
}
