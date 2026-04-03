"use client";

import { useState, useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import { useDebouncedCallback } from "use-debounce";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { searchSubjectsAction } from "@/app/(dashboard)/subjects/action";
import { SearchSubjectResult } from "@/services/subject.service";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { Spinner } from "./spinner";

interface SubjectSearchDialogProps {
  onSelect?: (subject: SearchSubjectResult["subjects"][number]) => void;
  children?: React.ReactNode;
  className?: ClassValue;
}

export function SubjectSearchDialog({
  onSelect,
  children,
  className,
}: SubjectSearchDialogProps) {
  const [open, setOpen] = useState(false);
  const { execute, result, isExecuting } = useAction(searchSubjectsAction);

  useEffect(() => {
    if (open) {
      execute({ q: "" });
    }
  }, [open]);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    execute({ q: value });
  }, 300);

  // make onClick of command item to add subject to the table
  const handleAddSubject = (
    subject: SearchSubjectResult["subjects"][number],
  ) => {
    setOpen(false);
    if (onSelect) {
      onSelect(subject);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <span className={cn(className)} onClick={() => setOpen(true)}>
        {children}
      </span>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <CommandInput
            name="q"
            placeholder="Search subjects..."
            onValueChange={debouncedSearch}
          />
          <CommandList>
            <CommandGroup heading="Subjects">
              {!isExecuting &&
                result.data?.subjects.map((subject) => (
                  <CommandItem
                    key={subject.id}
                    className="uppercase"
                    value={subject.id.toString()}
                    onSelect={() => handleAddSubject(subject)}
                  >
                    {subject.subject_code}
                    <CommandShortcut className="uppercase">
                      {subject.subject_name}
                    </CommandShortcut>
                  </CommandItem>
                ))}
              {isExecuting && (
                <CommandItem disabled>
                  <Spinner />
                  Loading...
                </CommandItem>
              )}
              <CommandEmpty>No results found.</CommandEmpty>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
