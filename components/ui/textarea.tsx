import { VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "",
        lg: "text-2xl h-auto",
      },
      variant: {
        outline:
          "border border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ",
        underline:
          "border-b-2 border-b-input rounded-none focus-visible:outline-none focus-visible:border-b-primary px-0",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "outline",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, variant, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ className, size, variant }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
