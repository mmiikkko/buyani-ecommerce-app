"use client";

import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";

const verifyCodeSchema = z.object({
  code: z
    .string()
    .length(6, { message: "Code must be 6 digits" })
    .regex(/^\d+$/, { message: "Code must contain only numbers" }),
});

type VerifyCodeValues = z.infer<typeof verifyCodeSchema>;

interface VerifyResetCodeFormProps {
  email: string;
}

export function VerifyResetCodeForm({ email }: VerifyResetCodeFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const router = useRouter();

  const form = useForm<VerifyCodeValues>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { code: "" },
  });

  async function onSubmit({ code }: VerifyCodeValues) {
    setError(null);

    try {
      const response = await fetch("/api/auth/mobile-verify-reset-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid or expired code");
        return;
      }

      // Navigate to new password page
      router.push(
        `/new-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`
      );
    } catch (error) {
      setError("Failed to verify code. Please try again.");
    }
  }

  async function handleResendCode() {
    setResending(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/mobile-forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setError("A new code has been sent to your email.");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to resend code");
      }
    } catch (error) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <Card className="mx-auto w-full max-w-md shadow-lg border border-border/60 bg-gradient-to-b from-background to-muted/40">
      <CardContent className="pt-6 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="text-xs text-muted-foreground text-center">
              Enter the 6-digit code from your email. It expires after a short time.
            </div>

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="text-center text-2xl tracking-widest"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div role="alert" className="text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-1/3 cursor-pointer"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <LoadingButton
                type="submit"
                className="w-2/3 cursor-pointer"
                loading={loading}
              >
                Verify Code
              </LoadingButton>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Didn&apos;t receive the code?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={handleResendCode}
                disabled={resending}
              >
                {resending ? "Sending..." : "Resend Code"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

