import { getServerSession } from "next-auth/next";
import { createSafeActionClient } from "next-safe-action";
import { redirect } from "next/navigation";
import { authOption } from "./auth";

export const actionClient = createSafeActionClient({
  defaultValidationErrorsShape: "flattened",
});

export const registrarActionClient = actionClient.use(async ({ next }) => {
  const session = await getServerSession(authOption);

  if (!session?.user?.roles?.includes("registrar")) {
    redirect("/unauthorized");
  }
  return next();
});

export const adminActionClient = actionClient.use(async ({ next }) => {
  const session = await getServerSession(authOption);

  if (!session?.user?.roles?.includes("admin")) {
    redirect("/unauthorized");
  }

  return next();
});

export const cashierActionClient = actionClient.use(async ({ next }) => {
  const session = await getServerSession(authOption);

  if (!session?.user?.roles?.includes("cashier")) {
    redirect("/unauthorized");
  }

  return next();
});
