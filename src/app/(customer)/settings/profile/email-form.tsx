"use client";

import { LoadingButton } from "@/components/loading-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/server/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export const updateEmailSchema = z.object({
  newEmail: z.email({ message: "Enter a valid email" }),
});

export type UpdateEmailValues = z.infer<typeof updateEmailSchema>;

interface EmailFormProps {
  currentEmail: string;
}

export function EmailForm({ currentEmail }: EmailFormProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateEmailValues>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      newEmail: currentEmail,
    },
  });

  async function onSubmit({ newEmail }: UpdateEmailValues) {
    setStatus(null);
    setError(null);

    const { error } = await authClient.changeEmail({
      newEmail,
      callbackURL: "/email-verified",
    });

    if (error) {
      setError(error.message || "Failed to make email change");
    } else {
      setStatus("Verification email sent to your current address");
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Change Email</CardTitle>
            <CardDescription className="mt-1">
              Update your email address. A verification email will be sent.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="newEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    New Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your new email address"
                      {...field}
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Current email: <span className="font-medium">{currentEmail}</span>
                  </p>
                </FormItem>
              )}
            />

            {error && (
              <div role="alert" className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            {status && (
              <div role="status" className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{status}</p>
              </div>
            )}
            <LoadingButton 
              type="submit" 
              loading={loading}
              className="w-full bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Request change
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
