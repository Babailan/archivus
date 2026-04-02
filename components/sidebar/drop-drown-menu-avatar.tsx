"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function DropdownMenuItemLogOut() {
  function log_out() {
    signOut({
      callbackUrl: "/login",
    });
  }
  return (
    <DropdownMenuItem variant="destructive" onClick={log_out}>
      <LogOut /> Log out
    </DropdownMenuItem>
  );
}
