import { Metadata } from "next";
import { CheckCircle2, Copy, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Enrollment Success",
};

export default async function EnrollmentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  async function copyToClipboard(text: string) {
    "use server";
    await navigator.clipboard.writeText(text);
  }

  if (!ref) {
    return (
      <div className="px-10 py-2 mb-10">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <h1 className="text-2xl font-bold text-muted-foreground mb-2">
            Invalid Request
          </h1>
          <p className="text-muted-foreground">
            Please complete the enrollment form first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-10 py-2 mb-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold">
            Enrollment Submitted Successfully!
          </h1>
          <p className="text-muted-foreground mt-2">
            Your enrollment application has been received. Please save your
            reference code below.
          </p>
        </div>

        <div className="bg-muted rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Your Reference Code
          </p>
          <p className="text-3xl font-mono font-bold tracking-wider">{ref}</p>
        </div>

        <p className="text-sm text-muted-foreground text-center mt-4">
          Please present this code when making payments or checking your
          enrollment status.
        </p>

        <div className="flex justify-center mt-8">
          <a
            href="/enroll"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Submit Another Enrollment
          </a>
        </div>
      </div>
    </div>
  );
}
