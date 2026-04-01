"use client";

import {
  CalculatorIcon,
  CalendarIcon,
  CreditCardIcon,
  SettingsIcon,
  SmileIcon,
  UserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import { Input } from "@/components/ui/input";
import { useAction } from "next-safe-action/hooks";
import { searchSubjectAction } from "../../subjects/action";
import { useEffect, useState } from "react";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { createCurriculum } from "./action";

export function CreateCurriculumForm() {
  const { execute ,result} = useAction(createCurriculum);
  console.log(result)
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          execute(new FormData(e.target));
        }}
      >
        <Input name="curriculum_name" />
        <Input name="curriculum_name" />
        {/* <FieldSet>
          <Field>
            <FieldLabel>
              Curriculum Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input />
          </Field>
          <Field>
            <FieldLabel>
              Curriculum Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input />
          </Field>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Grade Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="grade_1">Grade 1</SelectItem>
                <SelectItem value="grade_2">Grade 2</SelectItem>
                <SelectItem value="grade_3">Grade 3</SelectItem>
                <SelectItem value="grade_4">Grade 4</SelectItem>
                <SelectItem value="grade_5">Grade 5</SelectItem>
                <SelectItem value="grade_6">Grade 6</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FieldSet> */}
        <Button>Submit</Button>
      </form>
      <CommandBasic />
    </>
  );
}

function CommandBasic() {
  const [open, setOpen] = useState(false);
  const { isExecuting, execute, isPending } = useAction(searchSubjectAction);

  useEffect(() => {}, []);

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">
        Add Subjects
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput name="q" placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
