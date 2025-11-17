"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card className="bg-#EBFEEC border-1 shadow-md">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Billing Information</h2>
        </CardHeader>
        <CardContent>
          {/* Billing details and payment methods would go here */}
          <p>Your billing details will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
