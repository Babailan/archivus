"use server";

import {
  SubjectFindManyArgs,
  SubjectUpdateInput,
} from "@/app/generated/prisma/models";
import prisma from "@/lib/dbClient";
import { actionClient } from "@/lib/safe-action";
import { anyAmountHelper } from "@/lib/utils";
import { cacheTag, revalidatePath, revalidateTag, updateTag } from "next/cache";
import z from "zod";
import { zfd } from "zod-form-data";

const searchSubjectActionInputSchema = zfd.formData({
  q: zfd.text(z.string().default("")),
});

export const searchSubjectAction = actionClient
  .inputSchema(searchSubjectActionInputSchema)
  .action(async ({ parsedInput: { q } }) => {
    const select: SubjectFindManyArgs = {};
    if (q) {
      select.where = { OR: [{ subject_code: q }, { subject_name: q }] };
    }

    let find = await prisma.subject.findMany({
      ...select,
      include: {
        prices: {
          take: 1,
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });

    return {
      subjects: find.map((v) => ({
        ...v,
        prices: v.prices.map((p) => ({ ...p, price: p.price.toNumber() })),
      })),
    };
  });

const updateSubjectActionInputSchema = zfd.formData({
  id: zfd.numeric(z.number()),
  subject_code: z.string().optional(),
  subject_name: z.string().optional(),
  price: zfd.numeric(anyAmountHelper()).optional(),
});

export const updateSubjectAction = actionClient
  .inputSchema(updateSubjectActionInputSchema)
  .action(
    async ({ parsedInput: { id, subject_code, subject_name, price } }) => {
      // some field can be undefined, so we need to check if it is undefined
      const data: SubjectUpdateInput = {};
      if (subject_code) {
        data.subject_code = subject_code;
      }
      if (subject_name) {
        data.subject_name = subject_name;
      }
      if (price) {
        data.prices = { create: { price } };
      }
      await prisma.subject.update({
        where: { id },
        data: data,
      });
      revalidatePath("/subjects");
      return {
        success: true,
      };
    },
  );
