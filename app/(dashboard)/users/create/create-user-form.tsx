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
import { createUserAction } from "./action";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateUserForm() {
  const { executeAsync, result, isExecuting } = useAction(createUserAction);
  const [roles, setRoles] = useState<Roles[]>([]);
  const ref = useRef<HTMLFormElement>(null);

  const toggleRole = (role: Roles) => {
    setRoles((prev) => {
      if (prev.includes(role)) {
        return prev.filter((r) => r !== role);
      }
      return [...prev, role];
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("roles", JSON.stringify(roles));

    const { data } = await executeAsync(formData);
    if (data?.success) {
      toast.success("User created successfully");
      setRoles([]);
      ref.current?.reset();
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
              placeholder="Enter first name"
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
              placeholder="Enter last name"
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
              placeholder="Enter middle name"
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
            <Select name="gender">
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
              placeholder="Enter username"
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
              placeholder="Enter email"
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
              Password <span className="text-red-600">*</span>
            </FieldLabel>
            <Input
              type="password"
              aria-invalid={!!result?.validationErrors?.fieldErrors?.password}
              name="password"
              placeholder="Enter password"
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
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={roles.includes("registrar")}
                  onCheckedChange={() => toggleRole("registrar")}
                />
                Registrar
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={roles.includes("cashier")}
                  onCheckedChange={() => toggleRole("cashier")}
                />
                Cashier
              </label>
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
              Create User
            </Button>
          }
        ></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>
              Create a new user with the specified roles.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline">Cancel</Button>}
            ></DialogClose>
            <DialogClose
              render={
                <Button
                  onClick={() => {
                    ref.current?.requestSubmit();
                  }}
                  disabled={isExecuting}
                >
                  Create
                </Button>
              }
            ></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
