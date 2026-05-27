"use client";

import { Button } from "@/components/ui/button";
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
import { updateUserAction, toggleUserStatusAction } from "./action";
import { toast } from "sonner";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Roles } from "@/app/generated/prisma/enums";
import { UserWithRoles } from "@/services/user.service";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AVAILABLE_ROLES: Roles[] = ["registrar", "cashier"];

export function EditUserForm({ user }: { user: NonNullable<UserWithRoles> }) {
  const router = useRouter();
  const { executeAsync, result, isExecuting } = useAction(updateUserAction);
  const { execute: toggleStatus, isExecuting: isToggling } = useAction(
    toggleUserStatusAction,
    {
      onSuccess: () => {
        toast.success(
          `User ${user.inactive ? "activated" : "deactivated"} successfully`,
        );
        router.push("/users");
      },
    },
  );
  const [roles, setRoles] = useState<Roles[]>(user.roles as Roles[]);
  const ref = useRef<HTMLFormElement>(null);

  const toggleRole = (role: Roles) => {
    setRoles((prev) => {
      if (prev.includes(role)) {
        return prev.filter((r) => r !== role);
      }
      return [...prev, role];
    });
  };

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.set("roles", JSON.stringify(roles));
    formData.set("id", user.id.toString());

    const { data } = await executeAsync(formData);
    if (data?.success) {
      toast.success("User updated successfully");
      router.push("/users");
    }
  };

  return (
    <form ref={ref} onSubmit={onSubmit} autoComplete="off">
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel>
              First Name <span className="text-red-600">*</span>
            </FieldLabel>
            <Input
              name="first_name"
              defaultValue={user.first_name}
              aria-invalid={!!result?.validationErrors?.fieldErrors?.first_name}
            />
            <FieldError>
              {result?.validationErrors?.fieldErrors?.first_name}
            </FieldError>
          </Field>
          <Field>
            <FieldLabel>
              Last Name <span className="text-red-600">*</span>
            </FieldLabel>
            <Input
              name="last_name"
              defaultValue={user.last_name}
              aria-invalid={!!result?.validationErrors?.fieldErrors?.last_name}
            />
            <FieldError>
              {result?.validationErrors?.fieldErrors?.last_name}
            </FieldError>
          </Field>
          <Field>
            <FieldLabel>Middle Name</FieldLabel>
            <Input
              name="middle_name"
              defaultValue={user.middle_name || ""}
              aria-invalid={
                !!result?.validationErrors?.fieldErrors?.middle_name
              }
            />
            <FieldError>
              {result?.validationErrors?.fieldErrors?.middle_name}
            </FieldError>
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel>
              Gender <span className="text-red-600">*</span>
            </FieldLabel>
            <Select name="gender" defaultValue={user.gender}>
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            <FieldError>
              {result?.validationErrors?.fieldErrors?.gender}
            </FieldError>
          </Field>
          <Field>
            <FieldLabel>
              Birthdate <span className="text-red-600">*</span>
            </FieldLabel>
            <Input
              type="date"
              name="birthdate"
              defaultValue={
                new Date(user.birthdate).toISOString().split("T")[0]
              }
              aria-invalid={!!result?.validationErrors?.fieldErrors?.birthdate}
            />
            <FieldError>
              {result?.validationErrors?.fieldErrors?.birthdate}
            </FieldError>
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <FieldLabel>
              Username <span className="text-red-600">*</span>
            </FieldLabel>
            <Input
              name="username"
              defaultValue={user.username}
              aria-invalid={!!result?.validationErrors?.fieldErrors?.username}
            />
            <FieldError>
              {result?.validationErrors?.fieldErrors?.username}
            </FieldError>
          </Field>
          <Field>
            <FieldLabel>
              Email <span className="text-red-600">*</span>
            </FieldLabel>
            <Input
              type="email"
              aria-invalid={!!result?.validationErrors?.fieldErrors?.email}
              name="email"
              defaultValue={user.email}
              autoComplete="off"
            />
            <FieldError>
              {result?.validationErrors?.fieldErrors?.email}
            </FieldError>
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <FieldLabel>
              New Password <span className="text-red-600">*</span>
            </FieldLabel>
            <Input
              type="password"
              aria-invalid={!!result?.validationErrors?.fieldErrors?.password}
              name="password"
              placeholder="Enter new password to change"
            />
            <FieldError>
              {result?.validationErrors?.fieldErrors?.password}
            </FieldError>
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <FieldLabel>
              Roles <span className="text-red-600">*</span>
            </FieldLabel>
            <div className="flex gap-4 mt-2">
              {AVAILABLE_ROLES.map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={roles.includes(role)}
                    onCheckedChange={() => toggleRole(role)}
                  />
                  <span className="capitalize">{role}</span>
                </label>
              ))}
            </div>
            <FieldError>
              {result?.validationErrors?.fieldErrors?.roles}
            </FieldError>
          </Field>
        </FieldGroup>
      </FieldSet>

      <Dialog>
        <DialogTrigger
          render={
            <Button className="w-full mt-5" size={"lg"}>
              Update User
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
            <DialogDescription>
              Update this user with the specified roles.
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

      <Button
        type="button"
        variant="destructive"
        className="w-full mt-2"
        onClick={() => {
          if (
            confirm(
              `Are you sure you want to ${user.inactive ? "activate" : "deactivate"} this user?`,
            )
          ) {
            toggleStatus({ id: user.id });
          }
        }}
        disabled={isToggling}
      >
        {user.inactive ? "Activate" : "Deactivate"} User
      </Button>
    </form>
  );
}
