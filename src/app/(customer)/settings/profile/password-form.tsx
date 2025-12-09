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
import { Lock, Key, CheckCircle2, AlertCircle, Info, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: "Current password is required" }),
  newPassword: passwordSchema,
});

const setPasswordSchema = z.object({
  newPassword: passwordSchema,
});

type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;
type SetPasswordValues = z.infer<typeof setPasswordSchema>;

export function PasswordForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [hasOAuth, setHasOAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Fetch user account info
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setHasPassword(data.hasPassword ?? false);
          setHasOAuth(data.hasOAuth ?? false);
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserInfo();
  }, []);

  const changePasswordForm = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const setPasswordForm = useForm<SetPasswordValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  async function onSubmitChangePassword({
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
      changePasswordForm.reset();
    }
  }

  async function handleRequestPasswordSetup() {
    setStatus(null);
    setError(null);
    setSendingEmail(true);

    // For OAuth users, we need to use the forgot password flow to set an initial password
    // This will send them an email to set a password
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        const { error } = await authClient.requestPasswordReset({
          email: userData.email,
          redirectTo: "/reset-password",
        });

        if (error) {
          setError(error.message || "Failed to send password reset email");
        } else {
          setStatus("A password reset link has been sent to your email. Please check your inbox to set a password.");
        }
      } else {
        setError("Failed to fetch user information. Please try again.");
      }
    } catch (err) {
      console.error("Password setup error:", err);
      setError("Failed to request password reset. Please try again.");
    } finally {
      setSendingEmail(false);
    }
  }

  const changePasswordLoading = changePasswordForm.formState.isSubmitting;
  const setPasswordLoading = setPasswordForm.formState.isSubmitting;

  // Show loading state
  if (loading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Lock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Password Settings</CardTitle>
              <CardDescription className="mt-1">
                Loading account information...
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  // Show OAuth user message
  if (hasOAuth && !hasPassword) {
    return (
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Password Settings</CardTitle>
              <CardDescription className="mt-1">
                Manage your account password
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-blue-900">
                  You signed in with Google
                </p>
                <p className="text-sm text-blue-800">
                  Your account doesn't have a password because you signed in using your Google account. 
                  You can continue using "Sign in with Google" to access your account.
                </p>
                <p className="text-sm text-blue-800">
                  If you'd like to also be able to sign in with email and password, you can set a password 
                  by clicking the button below. We'll send you an email with instructions.
                </p>
              </div>
            </div>

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
            
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                onClick={handleRequestPasswordSetup}
                disabled={sendingEmail}
                className="w-full bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingEmail ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending email...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Send Password Setup Email
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Or{" "}
                <Link href="/forgot-password" className="text-[#2E7D32] hover:underline font-medium">
                  go to the forgot password page
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
        <Form {...changePasswordForm}>
          <form onSubmit={changePasswordForm.handleSubmit(onSubmitChangePassword)} className="space-y-5">
            <FormField
              control={changePasswordForm.control}
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
              control={changePasswordForm.control}
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
                    Use a strong password with at least 8 characters and one special character
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
              loading={changePasswordLoading}
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
