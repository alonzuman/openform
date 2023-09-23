"use client";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "~/components/ui/button";

export function FormFooter(props: {
  nextFieldId?: string;
  previousFieldId?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const updateFieldId = (newFieldId?: string) => {
    if (!newFieldId) return;

    const params = new URLSearchParams(searchParams);
    params.set("fieldId", newFieldId);
    router.replace(pathname + "?" + params.toString(), {
      scroll: false,
    });
  };

  return (
    <footer className="sticky bottom-0 p-4">
      <div className="flex justify-end">
        <Button
          disabled={!props.previousFieldId}
          onClick={() => updateFieldId(props.previousFieldId)}
          size="icon"
          className="rounded-r-none"
        >
          <ArrowUpIcon className="h-4 w-4" />
        </Button>
        <Button
          disabled={!props.nextFieldId}
          onClick={() => updateFieldId(props.nextFieldId)}
          size="icon"
          className="rounded-l-none"
        >
          <ArrowDownIcon className="h-4 w-4" />
        </Button>
        <Button asChild className="ml-2">
          <Link href="/">Powered by Openform</Link>
        </Button>
      </div>
    </footer>
  );
}
