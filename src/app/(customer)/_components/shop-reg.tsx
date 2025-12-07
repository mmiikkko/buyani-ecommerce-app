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
    <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl mx-auto gap-8 lg:gap-12">
      {/* LEFT SIDE LOGO & BRANDING */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 px-4 lg:px-8">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/30 to-amber-200/30 rounded-full blur-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-100/50">
            <Image
              src={Logo}
              alt="Buyani Logo"
              priority
              width={200}
              height={200}
              className="w-48 h-48 mx-auto object-contain"
            />
          </div>
        </div>
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-3xl lg:text-4xl font-bold text-emerald-700 tracking-tight">
            Become a Seller
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Join our marketplace and start selling your products to thousands of customers
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full">
              <span className="text-emerald-600 text-sm font-medium">✓ Easy Setup</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full">
              <span className="text-amber-600 text-sm font-medium">✓ Fast Approval</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="w-full lg:w-1/2 flex justify-center px-4">
        <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-3 pb-6">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-slate-900">
                Apply to Become a Seller
              </CardTitle>
              <CardDescription className="text-base text-slate-600">
                Fill out the form below to submit your shop application
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="shopName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">
                        Shop Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="My Awesome Store" 
                          className="h-11 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                          {...field} 
                        />
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
                      <FormLabel className="text-sm font-semibold text-slate-700">
                        Shop Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell customers about your shop, what makes it unique, and what products you'll be selling..."
                          className="min-h-[120px] resize-none border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                )}

                <LoadingButton
                  type="submit"
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  loading={loading}
                >
                  Register Shop
                </LoadingButton>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="pt-6 border-t border-slate-100">
            <div className="flex w-full justify-center">
              <p className="text-sm text-slate-500 text-center">
                Want to go back?{" "}
                <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2 transition-colors">
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
