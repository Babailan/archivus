"use client";

import { cn, sleep } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Spinner } from "../ui/spinner";

const schema = z.object({
  identifier: z.string().min(1, "Email or Username is required"),
  password: z.string().min(1, "Password is required"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"fieldset">) {
  const { formState, control, handleSubmit } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      identifier: "babi",
      password: "admin",
    },
  });
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  async function log_in(data: z.infer<typeof schema>) {
    const res = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (res?.ok) {
      await sleep(1000);
      setInvalidCredentials(false);
      window.location.replace("/dashboard");
    } else {
      setInvalidCredentials(true);
    }
  }
  return (
    <form autoComplete="noplease">
      <FieldSet className={cn("flex flex-col gap-6", className)} {...props}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Enter your email or username below to login to your account
            </p>
          </div>

          {invalidCredentials && (
            <Alert variant={"destructive"}>
              <ShieldAlert />
              <AlertTitle>Invalid credentials.</AlertTitle>
            </Alert>
          )}
          <Controller
            control={control}
            name="identifier"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="identifier">Email or Username</FieldLabel>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="name@example.com or username"
                  aria-invalid={fieldState.invalid}
                  autoComplete="noplease"
                  {...field}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Field>
            <Button
              onClick={handleSubmit(log_in)}
              type="submit"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting && <Spinner />}
              {formState.isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
