"use client";
import { useSearchParams } from "next/navigation";
import React, { PropsWithChildren, useEffect, useRef } from "react";

export function FieldWrapper(
  props: PropsWithChildren<{
    fieldId?: string;
  }>
) {
  const searchParams = useSearchParams();
  const activeFieldId = searchParams.get("fieldId");
  const isActive = activeFieldId === props.fieldId;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive) {
      if (ref.current) {
        ref.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    }
  }, [isActive]);

  return (
    <section
      ref={ref}
      className="h-[100dvh] snap-center flex p-4 max-w-2xl mx-auto justify-center flex-col"
    >
      {props.children}
    </section>
  );
}
