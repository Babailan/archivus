"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { toggleUserStatus } from "@/services/user.service";

export const restoreUserAction = actionClient
  .inputSchema(zfd.formData({ id: zfd.numeric() }))
  .action(async ({ parsedInput: { id } }) => {
    await toggleUserStatus(id);
    revalidatePath("/users/inactive");
    revalidatePath("/users");
    return { success: true };
  });
