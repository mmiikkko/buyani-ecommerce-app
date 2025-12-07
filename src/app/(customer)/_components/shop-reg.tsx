"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logo/Logo.png";
import { LoadingButton } from "@/components/loading-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";

const sellerSchema = z.object({
  shopName: z.string().min(1, { message: "Shop name is required" }),
  description: z.string().optional(),
});

type SellerValues = z.infer<typeof sellerSchema>;

export function SellerRegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SellerValues>({
    resolver: zodResolver(sellerSchema),
    defaultValues: {
      shopName: "",
      description: "",
    },
  });

  async function onSubmit(values: SellerValues) {
    setError(null);

    try {
      // Send API request to create seller shop
      const res = await fetch("/api/sellers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Something went wrong");
      }

      const data = await res.json();
      toast.success(data.message || "Shop application submitted successfully!");
      router.push("/");
    } catch (e) {
        const err = e as Error;
        console.log(err.message);
      }
  }

  const loading = form.formState.isSubmitting;

  return (
    <div className="flex items-center justify-center w-full h-full pt-53 pb-15">
      {/* LEFT SIDE LOGO */}
      <div className="flex flex-col hidden md:flex w-1/2 items-center justify-center">
        <Image
          src={Logo}
          alt="Logo"
          priority
          className="w-64 h-auto opacity-90"
        />
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="w-full md:w-1/2 flex justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Become a Seller
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Create your shop to start selling on our platform
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="shopName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shop Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Awesome Store" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shop Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell customers about your shop..."
                          className="min-h-[90px]"
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

                <LoadingButton
                  type="submit"
                  className="w-full"
                  loading={loading}
                >
                  Register Shop
                </LoadingButton>
              </form>
            </Form>
          </CardContent>

          <CardFooter>
            <div className="flex w-full justify-center border-t pt-4">
              <p className="text-muted-foreground text-center text-xs">
                Want to go back?{" "}
                <Link href="/" className="underline">
                  Return home
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
