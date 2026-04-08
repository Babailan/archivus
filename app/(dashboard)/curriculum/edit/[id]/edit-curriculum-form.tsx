"use client";
import { Button } from "@/components/ui/button";
import { SubjectSearchDialog } from "@/components/ui/subject-search-dialog";

import { Input } from "@/components/ui/input";
import { useAction } from "next-safe-action/hooks";
import { useRef, useState } from "react";
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
import { updateCurriculumAction } from "../../action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookX, Plus, Trash } from "lucide-react";
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
import { CurriculumWithSubjects } from "@/services/curriculum.service";
import { useRouter } from "next/navigation";

type ExistingSubject = {
  curriculum_id: number;
  subject_id: number;
  subject_name: string;
  subject_code: string;
  price: number;
  subject_price_id: number;
};

type NewSubject = SearchSubjectResult["subjects"][number];

export function EditCurriculumForm({
  curriculum,
}: {
  curriculum: NonNullable<CurriculumWithSubjects>;
}) {
  const router = useRouter();
  const { executeAsync, result, isExecuting } = useAction(
    updateCurriculumAction,
  );
  const [existingSubjects, setExistingSubjects] = useState<ExistingSubject[]>(
    curriculum.curriculum_subjects,
  );
  const [newSubjects, setNewSubjects] = useState<NewSubject[]>([]);
  const [miscellaneousFee, setMiscellaneousFee] = useState<number>(
    curriculum.miscellaneous_fee,
  );
  const ref = useRef<HTMLFormElement>(null);

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const allSubjects = [
      ...existingSubjects.map((s) => ({
        subjectPrice_id: s.subject_price_id,
        subject_id: s.subject_id,
      })),
      ...newSubjects.map((s) => ({
        subjectPrice_id: s.prices[0].id,
        subject_id: s.id,
      })),
    ];

    formData.append("subjects", JSON.stringify(allSubjects));
    formData.set("miscellaneous_fee", miscellaneousFee.toString());
    formData.set("id", curriculum.id.toString());

    const { data } = await executeAsync(formData);
    if (data?.success) {
      toast.success("Curriculum updated successfully");
      router.push("/curriculum");
    }
  };

  const removeExistingSubject = (subjectId: number) => {
    setExistingSubjects((prev) =>
      prev.filter((s) => s.subject_id !== subjectId),
    );
  };

  const removeNewSubject = (subjectId: number) => {
    setNewSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  };

  const allSubjects = [
    ...existingSubjects.map((s) => ({
      ...s,
      _type: "existing" as const,
    })),
    ...newSubjects.map((s) => ({
      ...s,
      _type: "new" as const,
      subject_price_id: s.prices[0].id,
      price: s.prices[0].price,
    })),
  ];

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
                defaultValue={curriculum.curriculum_name}
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
                defaultValue={curriculum.curriculum_code}
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
              <Select name="grade_level" defaultValue={curriculum.grade_level}>
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
                defaultValue={curriculum.miscellaneous_fee}
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
          <div className="flex items-end gap-5 flex-col">
            <SubjectSearchDialog
              onSelect={(subject) => {
                const allIds = [
                  ...existingSubjects.map((s) => s.subject_id),
                  ...newSubjects.map((s) => s.id),
                ];
                if (allIds.includes(subject.id)) {
                  toast.error("Subject already added");
                  return;
                }
                setNewSubjects((prev) => [...prev, subject]);
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
          <TableHeader>
            <TableRow>
              <TableHead>Subject Name</TableHead>
              <TableHead>Subject Code</TableHead>
              <TableHead>Price</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allSubjects.length === 0 ? (
              <TableRow>
                <TableCell className="font-medium" colSpan={4}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <BookX />
                      </EmptyMedia>
                      <EmptyTitle>No subjects added yet</EmptyTitle>
                      <EmptyDescription>
                        Add subjects to this curriculum
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {allSubjects.map((subject) => (
                  <TableRow
                    key={`${subject._type}-${
                      subject._type === "existing"
                        ? subject.subject_id
                        : subject.id
                    }`}
                  >
                    <TableCell className="capitalize">
                      {subject.subject_name}
                    </TableCell>
                    <TableCell className="capitalize">
                      {subject.subject_code}
                    </TableCell>
                    <TableCell>
                      <NumericFormat
                        value={"price" in subject ? subject.price : 0}
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
                        type="button"
                        onClick={() => {
                          if (subject._type === "existing") {
                            removeExistingSubject(subject.subject_id);
                          } else {
                            removeNewSubject(subject.id);
                          }
                        }}
                      >
                        <Trash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell />
                  <TableCell className="font-medium" colSpan={1}>
                    Accumulated Subject Fees
                  </TableCell>
                  <TableCell>
                    <NumericFormat
                      value={allSubjects.reduce(
                        (acc, s) => acc + ("price" in s ? s.price : 0),
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
                        allSubjects.reduce(
                          (acc, s) => acc + ("price" in s ? s.price : 0),
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
              </>
            )}
          </TableBody>
        </Table>

        <Dialog>
          <DialogTrigger
            render={
              <Button className="w-full mt-5" size={"lg"}>
                Update Curriculum
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Curriculum</DialogTitle>
              <DialogDescription>
                Update this curriculum for the school.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <DialogClose
                render={
                  <Button
                    onClick={() => {
                      ref.current?.requestSubmit();
                    }}
                    disabled={isExecuting}
                  >
                    Update
                  </Button>
                }
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </>
  );
}
