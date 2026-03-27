"use server";

import prisma from "@/app/libs/dbClient";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export async function createSubjectAction(
  data: FormData,
): Promise<ActionResponse> {
  const subject_name = data.get("subject_name") as string;
  const subject_code = data.get("subject_code") as string;

  if (!subject_name || !subject_code) {
    throw new Error("Subject name and code are required.");
  }
  try {
    const createdSubject = await prisma.subject.create({
      data: {
        subject_code,
        subject_name,
      },
    });
    await prisma.$disconnect();
    return {
      success: false,
      message: "Subject created successfully.",
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: error.message,
          success: false,
          errors: [
            {
              field: "subject_code",
              message: "This subject code exist already.",
            },
          ],
        };
      }
    }
    return {
      message: "Something went wrong",
      success: false,
    };
  }
}
