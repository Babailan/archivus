"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { updateStudentDetailAction } from "../action";
import { ArrowLeft, Save, FileText } from "lucide-react";

type StudentData = {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  date_of_birth: string;
  address: string;
  gender: "male" | "female";
  email: string;
};

type DocumentData = {
  id: number;
  name: string;
  description: string | null;
};

interface StudentEditFormProps {
  student: StudentData;
  activeDocuments: DocumentData[];
  checkedDocumentIds: number[];
}

export function StudentEditForm({
  student,
  activeDocuments,
  checkedDocumentIds,
}: StudentEditFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<StudentData>(student);
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>(checkedDocumentIds);

  const { executeAsync, isExecuting } = useAction(updateStudentDetailAction);

  const handleChange = (field: keyof StudentData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleDocument = (docId: number) => {
    setSelectedDocuments((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  const onSubmit = async () => {
    const formDataToSend = new FormData();
    formDataToSend.set("id", student.id.toString());
    formDataToSend.set("first_name", formData.first_name);
    formDataToSend.set("last_name", formData.last_name);
    formDataToSend.set("middle_name", formData.middle_name);
    formDataToSend.set("date_of_birth", formData.date_of_birth);
    formDataToSend.set("address", formData.address);
    formDataToSend.set("gender", formData.gender);
    formDataToSend.set("email", formData.email);

    selectedDocuments.forEach((docId) => {
      formDataToSend.append("document_ids", docId.toString());
    });

    const { data } = await executeAsync(formDataToSend);
    if (data?.success) {
      toast.success("Student details and checklist updated successfully");
      router.refresh();
    } else {
      toast.error("Failed to update student details");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/students")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              All fields below are editable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <FieldGroup>
                <Field>
                  <FieldLabel>First Name</FieldLabel>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Last Name</FieldLabel>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Middle Name</FieldLabel>
                  <Input
                    value={formData.middle_name}
                    onChange={(e) => handleChange("middle_name", e.target.value)}
                  />
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel>Date of Birth</FieldLabel>
                  <Input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleChange("date_of_birth", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Gender</FieldLabel>
                  <Select
                    value={formData.gender}
                    onValueChange={(val) => handleChange("gender", val as "male" | "female")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel>Address</FieldLabel>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/* Documents Checklist Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Documents Checklist</CardTitle>
            <CardDescription>
              Select submitted credentials for this student
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeDocuments.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No active documents found in system settings.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
                {activeDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition cursor-pointer"
                    onClick={() => handleToggleDocument(doc.id)}
                  >
                    <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedDocuments.includes(doc.id)}
                        onCheckedChange={() => handleToggleDocument(doc.id)}
                        id={`doc-${doc.id}`}
                      />
                    </div>
                    <div className="grid gap-1 leading-none select-none">
                      <label
                        htmlFor={`doc-${doc.id}`}
                        className="text-sm font-medium leading-none cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {doc.name}
                      </label>
                      {doc.description && (
                        <p className="text-xs text-muted-foreground pr-2">
                          {doc.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mt-6">
        <Dialog>
          <DialogTrigger
            render={
              <Button size="lg" className="w-full md:w-auto shadow-sm">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Changes</DialogTitle>
              <DialogDescription>
                Are you sure you want to save the changes to this student&apos;s personal info and document checklist?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <DialogClose
                render={
                  <Button onClick={onSubmit} disabled={isExecuting}>
                    {isExecuting ? "Saving..." : "Save"}
                  </Button>
                }
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
