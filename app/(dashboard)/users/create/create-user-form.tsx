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
import { Roles } from "@/app/generated/prisma/enums";

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

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.set("roles", JSON.stringify(roles));

    const { data, validationErrors } = await executeAsync(formData);
    if (data?.success) {
      toast.success("User created successfully");
      setRoles([]);
      ref.current?.reset();
    }
  };

  console.log(result.validationErrors);
  return (
    <form ref={ref} onSubmit={onSubmit} autoComplete="off">
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel>
              Username <span className="text-red-600">*</span>
            </FieldLabel>
            <Input
              name="username"
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
                <input
                  type="checkbox"
                  checked={roles.includes("registrar")}
                  onChange={() => toggleRole("registrar")}
                  className="w-4 h-4"
                />
                Registrar
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={roles.includes("cashier")}
                  onChange={() => toggleRole("cashier")}
                  className="w-4 h-4"
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
                    if (roles.length === 0) {
                      toast.error("Please select at least one role");
                      return;
                    }
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
