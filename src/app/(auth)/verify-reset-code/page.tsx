import { VerifyResetCodeForm } from "./verify-reset-code-form";
import { redirect } from "next/navigation";

interface VerifyResetCodePageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function VerifyResetCodePage({
  searchParams,
}: VerifyResetCodePageProps) {
  const params = await searchParams;
  const email = params.email;

  if (!email) {
    redirect("/forgot-password");
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="space-y-6 w-full">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Verify code</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent a 6-digit verification code to{" "}
            <span className="font-semibold text-foreground">{email}</span>.
            Please enter it below.
          </p>
        </div>
        <VerifyResetCodeForm email={email} />
      </div>
    </main>
  );
}

