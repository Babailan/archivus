import { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { EditUserForm } from "./edit-user-form";
import { getUser } from "@/services/user.service";
import { notFound } from "next/navigation";
import { Roles } from "@/app/generated/prisma/enums";

export const metadata: Metadata = {
  title: "Edit User",
};

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = parseInt(id);
  const user = await getUser(userId);

  if (!user) {
    notFound();
  }

  const isAdmin = user.roles.includes(Roles.admin);

  if (isAdmin) {
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
            <BreadcrumbLink render={<Link href={"/users"} />}>
              Users
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
          <h1 className="text-xl font-bold">Edit User</h1>
        </div>
      </div>
      <EditUserForm user={user} />
    </div>
  );
}
