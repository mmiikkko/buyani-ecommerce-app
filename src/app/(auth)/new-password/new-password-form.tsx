"use client";

import { LoadingButton } from "@/components/loading-button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type NewPasswordValues = z.infer<typeof newPasswordSchema>;

interface NewPasswordFormProps {
  email: string;
  code: string;
}

export function NewPasswordForm({ email, code }: NewPasswordFormProps) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit({ password }: NewPasswordValues) {
    setError(null);

    try {
      const response = await fetch("/api/auth/mobile-reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Failed to reset password";
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      // Show success toast and redirect to sign in
      toast.success("Password reset successful! You can now sign in with your new password.");
      setTimeout(() => {
        router.push("/sign-in");
      }, 1000);
    } catch (error) {
      const errorMessage = "Failed to reset password. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <Card className="mx-auto w-full max-w-md shadow-lg border border-border/60 bg-gradient-to-b from-background to-muted/40">
      <CardContent className="pt-6 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Confirm new password"
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

            <div className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm">
              <Info className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <p className="text-muted-foreground">
                Password should be at least 8 characters with a mix of letters,
                numbers, and symbols.
              </p>
            </div>

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
                Reset Password
              </LoadingButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

