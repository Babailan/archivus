"use client";
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

import { Input } from "@/components/ui/input";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { createCurriculum } from "./action";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookX, Icon, Plus, Save, Trash } from "lucide-react";
import { searchSubjectsAction } from "../../subjects/action";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GetSubjectResult } from "@/services/subject.service";
import { NumericFormat } from "react-number-format";
export function CreateCurriculumForm() {
  const { execute, result } = useAction(createCurriculum);
  const [subjects, setSubjects] = useState<GetSubjectResult["subjects"]>([]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          execute(new FormData(e.target));
        }}
      >
        <FieldSet>
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
            <Field>
              <FieldLabel>
                Curriculum Name <span className="text-red-600">*</span>
              </FieldLabel>
              <Input name="curriculum_name" />
            </Field>
            <Field>
              <FieldLabel>
                Curriculum Code <span className="text-red-600">*</span>
              </FieldLabel>
              <Input name="curriculum_code" />
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <FieldLabel>
                Grade Level <span className="text-red-600">*</span>
              </FieldLabel>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue />
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
            </Field>
          </FieldGroup>
        </FieldSet>
        <div className="flex items-center justify-between mt-5">
          <h1 className="text-lg font-semibold">Subjects</h1>
          <SubjectSearchDialog
            onSelect={(subject) => {
              setSubjects((prev) => [...prev, subject]);
            }}
          />
        </div>
        <Table className="mt-5 border rounded-md">
          <TableCaption>
            A list of subjects to be included in the curriculum.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Subject Name</TableHead>
              <TableHead>Subject Code</TableHead>
              <TableHead>Price</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.length === 0 ? (
              <EmptyRow />
            ) : (
              subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="capitalize">
                    {subject.subject_name}
                  </TableCell>
                  <TableCell className="capitalize">
                    {subject.subject_code}
                  </TableCell>
                  <TableCell>
                    <NumericFormat
                      value={subject.prices[0].price}
                      thousandSeparator=","
                      prefix="₱"
                      displayType="text"
                      decimalScale={2}
                    />
                  </TableCell>
                  <TableCell className="justify-end flex pr-5">
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => {
                        setSubjects((prev) =>
                          prev.filter((s) => s.id !== subject.id),
                        );
                      }}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
            {/* Make a total of all prices */}
            {subjects.length > 0 && (
              <TableRow>
                <TableCell />
                <TableCell className="font-bold" colSpan={1}>
                  Total
                </TableCell>
                <TableCell>
                  <NumericFormat
                    value={subjects.reduce(
                      (acc, subject) => acc + subject.prices[0].price,
                      0,
                    )}
                    thousandSeparator=","
                    prefix="₱"
                    displayType="text"
                    className="font-bold"
                    decimalScale={2}
                  />
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Button className="w-full mt-5">
          <Save /> Create Curriculum
        </Button>
      </form>
    </>
  );
}

function EmptyRow() {
  return (
    <TableRow>
      <TableCell className="font-medium" colSpan={4}>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookX />
            </EmptyMedia>
            <EmptyTitle>No subjects added yet</EmptyTitle>
            <EmptyDescription>Add subjects to this curriculum</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </TableCell>
    </TableRow>
  );
}

function SubjectSearchDialog({
  onSelect,
}: {
  onSelect?: (subject: GetSubjectResult["subjects"][number]) => void;
}) {
  const [open, setOpen] = useState(false);
  const { execute, result, isExecuting } = useAction(searchSubjectsAction);

  useEffect(() => {
    execute({ q: "" });
  }, []);

  // make onClick of command item to add subject to the table
  const handleAddSubject = (subject: GetSubjectResult["subjects"][number]) => {
    setOpen(false);
    if (onSelect) {
      onSelect(subject);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => setOpen(true)}
        variant={"secondary"}
        className="w-fit"
      >
        <Plus /> Add Subjects
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <CommandInput
            name="q"
            placeholder="Search subjects..."
            onValueChange={(value) => {
              execute({ q: value });
            }}
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
              <CommandEmpty>No results found.</CommandEmpty>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
