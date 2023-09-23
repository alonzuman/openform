"use client";
import { signOut } from "next-auth/react";
import React from "react";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";

export function DropdownMenuItemSignOutButton() {
  return <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>;
}
