"use client";

import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateEnrollmentSettingsAction } from "./action";
import {
  EnrollmentSettingsWithCurriculums,
  getCurriculumsByGradeLevel,
} from "@/services/enrollment-settings.service";
import { toast } from "sonner";
import { Save, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface EnrollmentSettingsFormProps {
  settings: EnrollmentSettingsWithCurriculums | null;
  curriculums: Awaited<ReturnType<typeof getCurriculumsByGradeLevel>>;
}

export function EnrollmentSettingsForm({
  settings,
  curriculums,
}: EnrollmentSettingsFormProps) {
  const { executeAsync, isExecuting, result } = useAction(
    updateEnrollmentSettingsAction,
  );

  const [grade1, setGrade1] = useState<string>(
    settings?.grade1_curriculum_id?.toString() ?? "",
  );
  const [grade2, setGrade2] = useState<string>(
    settings?.grade2_curriculum_id?.toString() ?? "",
  );
  const [grade3, setGrade3] = useState<string>(
    settings?.grade3_curriculum_id?.toString() ?? "",
  );
  const [grade4, setGrade4] = useState<string>(
    settings?.grade4_curriculum_id?.toString() ?? "",
  );
  const [grade5, setGrade5] = useState<string>(
    settings?.grade5_curriculum_id?.toString() ?? "",
  );
  const [grade6, setGrade6] = useState<string>(
    settings?.grade6_curriculum_id?.toString() ?? "",
  );
  const [isEnabled, setIsEnabled] = useState<boolean>(
    settings?.is_online_enrollment_enabled ?? false,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    if (grade1) formData.append("grade1_curriculum_id", grade1);
    if (grade2) formData.append("grade2_curriculum_id", grade2);
    if (grade3) formData.append("grade3_curriculum_id", grade3);
    if (grade4) formData.append("grade4_curriculum_id", grade4);
    if (grade5) formData.append("grade5_curriculum_id", grade5);
    if (grade6) formData.append("grade6_curriculum_id", grade6);
    formData.append("is_online_enrollment_enabled", isEnabled.toString());
    const { data } = await executeAsync(formData);
    if (data?.success) {
      toast.success("Enrollment settings updated successfully");
    }
  };

  const gradeLevels = [
    { key: "grade1", label: "Grade 1", value: grade1, setter: setGrade1 },
    { key: "grade2", label: "Grade 2", value: grade2, setter: setGrade2 },
    { key: "grade3", label: "Grade 3", value: grade3, setter: setGrade3 },
    { key: "grade4", label: "Grade 4", value: grade4, setter: setGrade4 },
    { key: "grade5", label: "Grade 5", value: grade5, setter: setGrade5 },
    { key: "grade6", label: "Grade 6", value: grade6, setter: setGrade6 },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <FieldSet>
        <FieldLegend variant="legend" className="flex gap-2 items-center">
          <Settings />
          Enrollment Settings
        </FieldLegend>
        <FieldDescription>
          Configure the curriculum for online enrollment and enable/disable the
          enrollment form.
        </FieldDescription>

        <FieldGroup className="mt-6 max-w-sm">
          <Field className="flex flex-row justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FieldLabel>Online Enrollment</FieldLabel>
              <p className="text-sm text-muted-foreground">
                Enable or disable the online enrollment form for applicants.
              </p>
            </div>
            <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
          </Field>
        </FieldGroup>

        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {gradeLevels.map((grade) => (
            <Field key={grade.key}>
              <FieldLabel>{grade.label}</FieldLabel>
              <Select
                value={grade.value}
                onValueChange={(v) => {
                  grade.setter(v ?? "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select curriculum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {curriculums
                      .filter((c) => c.grade_level === grade.key)
                      .map((curriculum) => (
                        <SelectItem
                          key={curriculum.id}
                          value={curriculum.id.toString()}
                        >
                          {curriculum.curriculum_name} (
                          {curriculum.curriculum_code})
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError />
            </Field>
          ))}
        </FieldGroup>

        <Button
          type="submit"
          className="mt-6 w-full md:w-auto cursor-pointer"
          disabled={isExecuting}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </FieldSet>
    </form>
  );
}
