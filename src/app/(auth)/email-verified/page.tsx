import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EmailVerifiedPage() {
  return (
    <main className="min-h-[calc(100vh-3rem)] flex flex-1 items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Email verified</h1>
          <p className="text-muted-foreground">
            Your email has been verified successfully.
          </p>
        </div>
        <Button asChild>
          <Link className="cursor-pointer" href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
