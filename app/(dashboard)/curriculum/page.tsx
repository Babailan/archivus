import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function SubjectListPage() {

  return (
    <div className="p-10">
      <Breadcrumb className="mb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Curriculum</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-bold">List of Curriculum</h1>
        </div>
        <div>
          <Link href={"/curriculum/create"}>
            <Button className="cursor-pointer">
              <Plus /> New Curriculum
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
