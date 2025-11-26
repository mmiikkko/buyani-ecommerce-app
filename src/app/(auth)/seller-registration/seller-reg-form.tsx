"use client";

import Image from "next/image";
import Logo from "@/assets/logo/Logo.png";
import { LoadingButton } from "@/components/loading-button";
import {
  Card,
  CardContent,
  CardDescription,
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
      const res = await fetch("/api/seller/register", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Something went wrong");
      }

      toast.success("Seller profile created!");
      router.push("/seller/dashboard");
    } catch (e: unknown) {
        if (e instanceof Error) {
            setError(e.message); // Access `message` only if `e` is an instance of Error
          } else {
            setError("An unknown error occurred");
          }
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <div className="flex items-center justify-center w-full h-full">
      {/* LEFT SIDE LOGO */}
      <div className="flex flex-col hidden md:flex w-1/2 items-center justify-center">
        <Image
            src={Logo}
            alt="Logo"
            priority
            width={335}
            height={335}
            className="opacity-53"
        />
        <div className="text-left mb-8">
            <h1 className="text-[3A3A3A] text-2xl font-bold">Sign up for an account</h1>
            <h1 className="text-[3A3A3A] text-2xl font-bold">for <span className="text-[#FF6F00]">FREE</span></h1>
            <p>Sell your products nationwide to millions </p>
            <p>of customers 24/7</p>
        </div>

        </div>

      {/* RIGHT SIDE FORM */}
      <div className="w-full md:w-1/2 flex justify-center px-4">
        <Card className="w-full max-w-md shadow-2xl rounded-3xl">
          <CardHeader>
            <CardTitle className="text-[#2E7D32] text-lg md:text-md">
                Create Your Seller Account
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
                Join our growing community of local sellers
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
                  className="w-full mt-5 cursor-pointer"
                  loading={loading}
                >
                  Register Shop
                </LoadingButton>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
