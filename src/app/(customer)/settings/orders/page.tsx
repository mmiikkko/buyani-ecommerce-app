"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/orders");
  }, [router]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-6">
      <Card className="border shadow-sm">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-slate-900">Billing Information</h2>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-700">
          <p>
            Your billing details will appear here once you place an order or add a payment
            method.
          </p>
          <div>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}