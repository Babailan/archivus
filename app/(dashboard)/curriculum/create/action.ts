"use server";

import { actionClient } from "@/lib/safe-action";
import z from "zod";
import { zfd } from "zod-form-data";


export const createCurriculum = actionClient
  .inputSchema(zfd.formData({
    curriculum_name:zfd.repeatable(z.array(zfd.text()))
  }))
  .action(async ({parsedInput:{curriculum_name}}) => {
    return {}
  });
