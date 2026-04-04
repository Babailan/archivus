import { CreateUserForm } from "./create-user-form";

export default function CreateUserPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Create User</h1>
      <CreateUserForm />
    </div>
  );
}
