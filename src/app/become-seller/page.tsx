"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SellerRegisterForm } from "@/app/(customer)/_components/shop-reg";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo/Logo.png";
import { Badge } from "@/components/ui/badge";

type UserInfo = {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  hasShop: boolean;
  shop: {
    id: string;
    shopName: string;
    status: string;
  } | null;
};

export default function BecomeSellerPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUserInfo(data);
          
          // If user is already a seller with approved shop, redirect
          if (data.role === "seller" && data.shop?.status === "approved") {
            router.push("/seller");
            return;
          }
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50 flex items-center justify-center">
        <div className="container mx-auto px-4 py-12 sm:py-16 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl mx-auto gap-8 lg:gap-12">
            {/* LEFT SIDE LOGO */}
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
              </div>
            </div>

            {/* RIGHT SIDE LOGIN/SIGNUP */}
            <div className="w-full lg:w-1/2 flex justify-center px-4">
              <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="space-y-3">
                  <CardTitle className="text-2xl font-bold text-slate-900">Sign In Required</CardTitle>
                  <CardDescription className="text-base text-slate-600">
                    You need to have an account to become a seller
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="font-semibold text-slate-900">Requirements to become a seller:</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-0.5">✓</span>
                        <span>Valid email address</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-0.5">✓</span>
                        <span>Unique shop name</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-0.5">✓</span>
                        <span>Shop description</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-0.5">✓</span>
                        <span>Admin approval (after submission)</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-3 pt-2">
                    <Button asChild className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg">
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full h-11 border-slate-200 hover:bg-slate-50">
                      <Link href="/sign-up">Create Account</Link>
                    </Button>
                  </div>
                  <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-100">
                    <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2 transition-colors">
                      Return to home
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is logged in - check shop status
  if (userInfo.hasShop) {
    const shopStatus = userInfo.shop?.status;
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50 flex items-center justify-center">
        <div className="container mx-auto px-4 py-12 sm:py-16 w-full">
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="space-y-3">
                <CardTitle className="text-2xl font-bold text-slate-900">Shop Application Status</CardTitle>
                <CardDescription className="text-base text-slate-600">
                  Your shop application status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm font-medium text-slate-600 mb-2">Shop Name:</p>
                  <p className="text-lg font-semibold text-slate-900">{userInfo.shop?.shopName}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm font-medium text-slate-600 mb-3">Status:</p>
                  <Badge
                    className={
                      shopStatus === "approved"
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200 px-4 py-1.5 text-sm font-semibold"
                        : shopStatus === "pending"
                        ? "bg-amber-100 text-amber-700 border-amber-200 px-4 py-1.5 text-sm font-semibold"
                        : "bg-red-100 text-red-700 border-red-200 px-4 py-1.5 text-sm font-semibold"
                    }
                  >
                    {shopStatus === "approved"
                      ? "✓ Approved"
                      : shopStatus === "pending"
                      ? "⏳ Pending Approval"
                      : "✗ Rejected"}
                  </Badge>
                </div>
                {shopStatus === "approved" && (
                  <Button asChild className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg">
                    <Link href="/seller">Go to Seller Dashboard</Link>
                  </Button>
                )}
                {shopStatus === "pending" && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800">
                      Your shop application is being reviewed. You will be notified once your request is approved.
                    </p>
                  </div>
                )}
                <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-100">
                  <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2 transition-colors">
                    Return to home
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // User is logged in but doesn't have a shop - show application form
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-12 sm:py-16 w-full">
        <SellerRegisterForm />
      </div>
    </div>
  );
}

