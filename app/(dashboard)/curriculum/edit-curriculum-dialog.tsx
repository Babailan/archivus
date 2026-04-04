"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function EditCurriculumDialog({ id }: { id: number }) {
  return (
    <DropdownMenuItem
      render={
        <Link href={`/curriculum/edit/${id}`}>
          <Button variant={"ghost"} className="w-full justify-start">
            Edit
          </Button>
        </Link>
      }
    />
  );
}
