import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { EditCurriculumForm } from "./edit-curriculum-form";
import { getCurriculum } from "@/services/curriculum.service";
import { notFound } from "next/navigation";

export default async function EditCurriculumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const curriculumId = parseInt(id);
  const curriculum = await getCurriculum(curriculumId);

  if (!curriculum) {
    notFound();
  }

  return (
    <div className="p-10">
      <Breadcrumb className="mb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={"/dashboard"} />}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={"/curriculum"} />}>
              Curriculum
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center mb-5">
        <div>
          <h1 className="text-xl font-bold">Edit Curriculum</h1>
        </div>
      </div>
      <EditCurriculumForm curriculum={curriculum} />
    </div>
  );
}
