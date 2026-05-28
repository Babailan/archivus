import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">403</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          You do not have permission to access this resource.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block text-sm text-primary underline underline-offset-4"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
