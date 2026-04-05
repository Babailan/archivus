"use server";

import { adminActionClient } from "@/lib/safe-action";
import {
  getRollbackRequests,
  getPendingRollbackCount,
} from "@/services/rollback.service";
import { revalidatePath } from "next/cache";
import {
  approveRollbackRequest,
  denyRollbackRequest,
} from "@/services/rollback.service";
import { zfd } from "zod-form-data";
import { z } from "zod";

export async function getRollbackRequestsAction(status?: string) {
  return await getRollbackRequests(status);
}

export async function getPendingRollbackCountAction() {
  return await getPendingRollbackCount();
}

const approveRollbackInputSchema = zfd.formData({
  id: zfd.numeric(z.number()),
});

export const approveRollbackAction = adminActionClient
  .inputSchema(approveRollbackInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      await approveRollbackRequest(parsedInput.id);
      revalidatePath("/rollback-requests");
      revalidatePath("/enrollments");
      revalidatePath("/payments");
      return { success: true };
    } catch (error) {
      return { error: (error as Error).message };
    }
  });

const denyRollbackInputSchema = zfd.formData({
  id: zfd.numeric(z.number()),
});

export const denyRollbackAction = adminActionClient
  .inputSchema(denyRollbackInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      await denyRollbackRequest(parsedInput.id);
      revalidatePath("/rollback-requests");
      return { success: true };
    } catch (error) {
      return { error: (error as Error).message };
    }
  });
