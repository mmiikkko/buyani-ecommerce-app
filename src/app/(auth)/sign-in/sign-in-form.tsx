"use client";

import { GoogleIcon } from "@/assets/icons/GoogleIcon";
import { LoadingButton } from "@/components/loading-button";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useLanguage } from "@/lib/i18n/context";

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { t } = useLanguage();

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit({ email, password, rememberMe }: SignInValues) {
    setError(null);
    setLoading(true);

    toast.loading(t("signing-in"));

    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    });

    setLoading(false);

    toast.dismiss();

    if (error) {
      setError(error.message || t("something-wrong"));
    } else {
      toast.success(t("signed-in-success"));
      router.push(redirect ?? "/");
    }
  }

  async function handleSocialSignIn(provider: "google") {
    setError(null);
    setLoading(true);
    
    try {
      const callbackURL = redirect || "/";
      const { error, data } = await authClient.signIn.social({
        provider,
        callbackURL,
      });

      if (error) {
        setError(error.message || t("something-wrong"));
        toast.error(error.message || t("failed-google-signin"));
        setLoading(false);
      } else if (data?.url) {
        // Redirect to Google OAuth URL - don't set loading to false as we're redirecting
        // eslint-disable-next-line react-hooks/immutability
        window.location.href = data.url;
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(t("failed-google-signin"));
      toast.error(t("failed-google-signin"));
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{t("sign-in")}</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {t("sign-in-desc")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>{t("password")}</FormLabel>
                  </div>
                  <FormControl>
                    <PasswordInput
                      autoComplete="current-password"
                      placeholder={t("password")}
                      {...field}
                    />
                  </FormControl>

                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    {t("forgot-password")}
                  </Link>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>{t("remember-me")}</FormLabel>
                </FormItem>
              )}
            />

            {error && (
              <div role="alert" className="text-sm text-red-600">
                {error}
              </div>
            )}

            <LoadingButton type="submit" className="w-full cursor-pointer" loading={loading}>
              {t("login-button")}
            </LoadingButton>

            <div className="flex w-full flex-col items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 cursor-pointer"
                disabled={loading}
                onClick={() => handleSocialSignIn("google")}
              >
                <GoogleIcon width="0.98em" height="1em" />
                {t("sign-in-google")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-center border-t pt-4">
          <p className="text-muted-foreground text-center text-xs">
            {t("no-account")}{" "}
            <Link href="/sign-up" className="underline">
              {t("sign-up")}
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
