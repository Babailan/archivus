import { Resend } from "resend";
import { EnrollmentReferenceEmail } from "@/components/emails/enrollment-reference";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReferenceCodeEmail(params: {
  to: string;
  applicantName: string;
  referenceCode: string;
  gradeLevel: string;
  schoolYear: string;
}) {
  const { to, applicantName, referenceCode, gradeLevel, schoolYear } = params;

  const { data, error } = await resend.emails.send({
    from: "Maniso School Christian Academy <onboarding@resend.dev>",
    to,
    subject: `Your Enrollment Reference Code - ${referenceCode}`,
    react: EnrollmentReferenceEmail({
      applicantName,
      referenceCode,
      gradeLevel,
      schoolYear,
    }),
  });

  if (error) {
    console.error("Failed to send enrollment email:", error);
    return;
  }

  console.log("Enrollment email sent:", data?.id);
}
