import { Metadata } from "next";
import { CreateUserForm } from "./create-user-form";

export const metadata: Metadata = {
  title: "Create User",
};

export default function CreateUserPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Create User</h1>
      <CreateUserForm />
    </div>
  );
}
