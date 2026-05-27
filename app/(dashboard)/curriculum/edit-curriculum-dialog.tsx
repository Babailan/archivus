"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function EditCurriculumDialog({ id }: { id: number }) {
  const router = useRouter();
  return (
    <DropdownMenuItem onClick={() => router.push(`/curriculum/edit/${id}`)}>
      Edit
    </DropdownMenuItem>
  );
}
