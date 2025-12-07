"use client";

import { LoadingButton } from "@/components/loading-button";
import { PasswordInput } from "@/components/password-input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { passwordSchema } from "@/lib/validation";
import { authClient } from "@/server/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Key, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: "Current password is required" }),
  newPassword: passwordSchema,
});

type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

export function PasswordForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  async function onSubmit({
    currentPassword,
    newPassword,
  }: UpdatePasswordValues) {
    setStatus(null);
    setError(null);

    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      setError(error.message || "Failed to change password");
    } else {
      setStatus("Password was changed successfully");
      form.reset();
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Lock className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Change Password</CardTitle>
            <CardDescription className="mt-1">
              Update your password to keep your account secure
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* OAuth users (without a password) can use the "forgot password" flow */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Current Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput 
                      {...field} 
                      placeholder="Enter your current password" 
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    New Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput 
                      {...field} 
                      placeholder="Enter your new password" 
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Use a strong password with at least 8 characters
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
              <Lock className="h-4 w-4 mr-2" />
              Change password
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
