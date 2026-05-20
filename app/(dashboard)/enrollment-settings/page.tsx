import { Metadata } from "next";
import { EnrollmentSettingsForm } from "./enrollment-settings-form";
import {
  getCurriculumsByGradeLevel,
  getEnrollmentSettings,
} from "@/services/enrollment-settings.service";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Enrollment Settings",
};

export default async function EnrollmentSettingsPage() {
  const [settings, curriculums] = await Promise.all([
    getEnrollmentSettings(),
    getCurriculumsByGradeLevel(),
  ]);

  return (
    <div className="p-10">
      <Breadcrumb className="mb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard" />}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Enrollment Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <EnrollmentSettingsForm settings={settings} curriculums={curriculums} />
    </div>
  );
}
