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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col md:flex-row w-full max-w-6xl">
          {/* LEFT SIDE LOGO */}
          <div className="flex flex-col hidden md:flex w-1/2 items-center justify-center p-8">
            <Image
              src={Logo}
              alt="Logo"
              priority
              className="w-64 h-auto opacity-90 mb-8"
            />
            <h2 className="text-2xl font-bold text-[#2E7D32] mb-4">
              Become a Seller
            </h2>
            <p className="text-gray-600 text-center max-w-md">
              Join our marketplace and start selling your products to thousands of customers.
            </p>
          </div>

          {/* RIGHT SIDE LOGIN/SIGNUP */}
          <div className="w-full md:w-1/2 flex justify-center items-center p-8">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-xl">Sign In Required</CardTitle>
                <CardDescription>
                  You need to have an account to become a seller
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Requirements to become a seller:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Valid email address</li>
                    <li>Unique shop name</li>
                    <li>Shop description</li>
                    <li>Admin approval (after submission)</li>
                  </ul>
                </div>
                <div className="flex flex-col gap-2 pt-4">
                  <Button asChild className="w-full">
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/sign-up">Create Account</Link>
                  </Button>
                </div>
                <div className="text-center text-sm text-gray-500 pt-4 border-t">
                  <Link href="/" className="hover:underline">
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

  // User is logged in - check shop status
  if (userInfo.hasShop) {
    const shopStatus = userInfo.shop?.status;
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">Shop Application Status</CardTitle>
            <CardDescription>
              Your shop application status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Shop Name:</p>
              <p className="font-semibold">{userInfo.shop?.shopName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Status:</p>
              <Badge
                className={
                  shopStatus === "approved"
                    ? "bg-green-100 text-green-700"
                    : shopStatus === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }
              >
                {shopStatus === "approved"
                  ? "Approved"
                  : shopStatus === "pending"
                  ? "Pending Approval"
                  : "Rejected"}
              </Badge>
            </div>
            {shopStatus === "approved" && (
              <Button asChild className="w-full">
                <Link href="/seller">Go to Seller Dashboard</Link>
              </Button>
            )}
            {shopStatus === "pending" && (
              <p className="text-sm text-gray-600">
                Your shop application is being reviewed. You will be notified once it's approved.
              </p>
            )}
            <div className="text-center text-sm text-gray-500 pt-4 border-t">
              <Link href="/" className="hover:underline">
                Return to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is logged in but doesn't have a shop - show application form
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#2E7D32] mb-2">
            Apply to Become a Seller
          </h1>
          <p className="text-gray-600">
            Fill out the form below to submit your shop application
          </p>
        </div>
        <SellerRegisterForm />
      </div>
    </div>
  );
}

