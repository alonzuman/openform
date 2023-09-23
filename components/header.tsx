import React, { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import { cn } from "~/lib/utils";

export function Header(
  props: PropsWithChildren<ComponentPropsWithoutRef<"header">>
) {
  return (
    <header
      {...props}
      className={cn(
        "flex justify-between p-4 fixed items-center top-0 h-16 left-0 right-0 z-10",
        props.className
      )}
    />
  );
}
