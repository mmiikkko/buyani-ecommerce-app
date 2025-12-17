import { NewPasswordForm } from "./new-password-form";
import { redirect } from "next/navigation";

interface NewPasswordPageProps {
  searchParams: Promise<{ email?: string; code?: string }>;
}

export default async function NewPasswordPage({
  searchParams,
}: NewPasswordPageProps) {
  const params = await searchParams;
  const email = params.email;
  const code = params.code;

  if (!email || !code) {
    redirect("/forgot-password");
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="space-y-6 w-full">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">New password</h1>
          <p className="text-muted-foreground">
            Enter your new password below. Make sure it&apos;s at least 8
            characters long.
          </p>
        </div>
        <NewPasswordForm email={email} code={code} />
      </div>
    </main>
  );
}

