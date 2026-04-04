import { getServerSession } from "next-auth/next";
import { createSafeActionClient } from "next-safe-action";
import { redirect } from "next/navigation";

export const actionClient = createSafeActionClient({
  defaultValidationErrorsShape: "flattened",
});

export const registrarActionClient = actionClient.use(async ({ next }) => {
  const session = await getServerSession();

  return next();
});

export const adminActionClient = actionClient.use(async ({ next }) => {
  const session = await getServerSession();

  return next();
});
