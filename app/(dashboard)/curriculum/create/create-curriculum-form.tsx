"use client";
import { Button } from "@/components/ui/button";
import { SubjectSearchDialog } from "@/components/ui/subject-search-dialog";

import { Input } from "@/components/ui/input";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useRef, useState } from "react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { createCurriculumAction } from "./action";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookX, Plus, Save, Trash } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { SearchSubjectResult } from "@/services/subject.service";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { PesoInput } from "@/components/ui/peso-input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CreateCurriculumForm() {
  const { executeAsync, result, isExecuting } = useAction(
    createCurriculumAction,
  );
  const [subjects, setSubjects] = useState<SearchSubjectResult["subjects"]>([]);
  // miscellaneous fee
  const [miscellaneousFee, setMiscellaneousFee] = useState<number>(0);
  const ref = useRef<HTMLFormElement>(null);
  // make a submit function
  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    formData.append(
      "subjects",
      JSON.stringify(
        subjects.map((subject) => ({
          subjectPrice_id: subject.prices[0].id,
          subject_id: subject.id,
        })),
      ),
    );
    formData.set("miscellaneous_fee", miscellaneousFee.toString());

    const { data, validationErrors } = await executeAsync(formData);
    if (data?.success) {
      toast.success("Curriculum created successfully");
      setSubjects([]);
      setMiscellaneousFee(0);
      ref.current?.reset();
    }
  };

  return (
    <>
      <form ref={ref} onSubmit={onSubmit} autoComplete="off">
        <FieldSet>
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
            <Field>
              <FieldLabel>
                Curriculum Name <span className="text-red-600">*</span>
              </FieldLabel>
              <Input
                aria-invalid={
                  !!result?.validationErrors?.fieldErrors?.curriculum_name
                }
                name="curriculum_name"
              />
              <FieldError>
                {result?.validationErrors?.fieldErrors?.curriculum_name}
              </FieldError>
            </Field>
            <Field>
              <FieldLabel>
                Curriculum Code <span className="text-red-600">*</span>
              </FieldLabel>
              <Input
                aria-invalid={
                  !!result?.validationErrors?.fieldErrors?.curriculum_code
                }
                name="curriculum_code"
              />
              <FieldError>
                {result?.validationErrors?.fieldErrors?.curriculum_code}
              </FieldError>
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <FieldLabel>
                Grade Level <span className="text-red-600">*</span>
              </FieldLabel>
              <Select name="grade_level">
                <SelectTrigger
                  className="w-full"
                  aria-invalid={
                    !!result?.validationErrors?.fieldErrors?.grade_level
                  }
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="grade1">Grade 1</SelectItem>
                    <SelectItem value="grade2">Grade 2</SelectItem>
                    <SelectItem value="grade3">Grade 3</SelectItem>
                    <SelectItem value="grade4">Grade 4</SelectItem>
                    <SelectItem value="grade5">Grade 5</SelectItem>
                    <SelectItem value="grade6">Grade 6</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError>
                {result?.validationErrors?.fieldErrors?.grade_level}
              </FieldError>
            </Field>
            <Field>
              <FieldLabel>Miscellaneous Fee</FieldLabel>
              <NumericFormat
                customInput={PesoInput}
                thousandSeparator
                decimalScale={2}
                onValueChange={(values) => {
                  setMiscellaneousFee(values.floatValue || 0);
                }}
                name="miscellaneous_fee"
                aria-invalid={
                  !!result?.validationErrors?.fieldErrors?.miscellaneous_fee
                }
              />
              <FieldError>
                {result?.validationErrors?.fieldErrors?.miscellaneous_fee}
              </FieldError>
            </Field>
          </FieldGroup>
        </FieldSet>
        <div className="flex items-center justify-between mt-5">
          <h1 className="text-lg font-semibold">Subjects</h1>
          <div className="flex  items-end gap-5 flex-col">
            <SubjectSearchDialog
              onSelect={(subject) => {
                if (subjects.find((s) => s.id === subject.id)) {
                  toast.error("Subject already added");
                  return;
                }
                setSubjects((prev) => [...prev, subject]);
              }}
            >
              <Button
                type="button"
                variant={"secondary"}
                className="w-fit"
                aria-invalid={!!result?.validationErrors?.fieldErrors?.subjects}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Subjects
              </Button>
            </SubjectSearchDialog>
            <FieldError>
              {result?.validationErrors?.fieldErrors?.subjects}
            </FieldError>
          </div>
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
                      prefix="₱ "
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
            {subjects.length > 0 && (
              <TableRow>
                <TableCell />
                <TableCell className="font-medium" colSpan={1}>
                  Accumulated Subject Fees
                </TableCell>
                <TableCell>
                  <NumericFormat
                    value={subjects.reduce(
                      (acc, subject) => acc + subject.prices[0].price,
                      0,
                    )}
                    thousandSeparator=","
                    prefix="₱ "
                    displayType="text"
                    className="font-medium"
                    decimalScale={2}
                  />
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            )}

            <TableRow>
              <TableCell />
              <TableCell className="font-medium" colSpan={1}>
                Miscellaneous Fee
              </TableCell>
              <TableCell>
                <NumericFormat
                  value={miscellaneousFee}
                  thousandSeparator=","
                  prefix="₱ "
                  displayType="text"
                  className="font-medium"
                  decimalScale={2}
                />
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell className="font-medium" colSpan={1}>
                Total Tuition
              </TableCell>
              <TableCell>
                <NumericFormat
                  value={
                    subjects.reduce(
                      (acc, subject) => acc + subject.prices[0].price,
                      0,
                    ) + miscellaneousFee
                  }
                  thousandSeparator=","
                  prefix="₱ "
                  displayType="text"
                  className="font-medium"
                  decimalScale={2}
                />
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Dialog>
          <DialogTrigger
            render={
              <Button className="w-full mt-5" size={"lg"}>
                Create Curriculum
              </Button>
            }
          ></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Curriculum</DialogTitle>
              <DialogDescription>
                Create a new curriculum for the school.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose
                render={<Button variant="outline">Cancel</Button>}
              ></DialogClose>
              <DialogClose
                render={
                  <Button
                    onClick={() => {
                      ref.current?.requestSubmit();
                    }}
                    disabled={isExecuting}
                  >
                    Create
                  </Button>
                }
              ></DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
