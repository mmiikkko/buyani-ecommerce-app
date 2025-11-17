import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInForm } from "./sign-in-form";

export default function SignIn() {
  return (
    <main className="flex flex-col min-h-svh justify-center px-4">
      <div className="w-full max-w-md mx-auto flex flex-col gap-6 items-start">
        <Link href="/">
          <Button className="w-fit">Go back to home</Button>
        </Link>
        <SignInForm />
      </div>
    </main>
  );
}
