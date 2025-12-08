"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  FileText,
  Download,
  Sparkles,
} from "lucide-react";

const billingProfile = {
  name: "Tele Bugay",
  email: "tele@example.com",
  phone: "+63 912 345 6789",
  address: "Blk 3 Lot 7, University Ave., Daet, Camarines Norte",
  plan: "Marketplace Customer",
};

const paymentMethods = [
  { brand: "Visa", last4: "4242", expiry: "08/27", default: true },
  { brand: "GCash", last4: "7821", expiry: "N/A", default: false },
];

const invoices = [
  { id: "INV-1042", date: "Jan 12, 2026", amount: "₱1,240.00", status: "Paid" },
  { id: "INV-1037", date: "Dec 02, 2025", amount: "₱540.00", status: "Paid" },
  { id: "INV-1029", date: "Nov 18, 2025", amount: "₱890.00", status: "Paid" },
];

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div className="overflow-hidden rounded-2xl border bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 text-white shadow-lg">
        <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <p className="text-sm uppercase tracking-[0.18em] text-white/80">Billing</p>
            <h1 className="text-2xl font-semibold">Billing Information</h1>
            <p className="text-sm text-white/85">
              Manage your billing profile, payment methods, and download invoices.
            </p>
          </div>
          <Button variant="secondary" size="sm" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Update details
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-emerald-50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Billing Profile</CardTitle>
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
              {billingProfile.plan}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span className="font-semibold text-slate-900">{billingProfile.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-emerald-600" />
              <span>{billingProfile.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-emerald-600" />
              <span>{billingProfile.phone}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-emerald-600" />
              <span>{billingProfile.address}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Payment Methods</CardTitle>
            <Button variant="ghost" size="sm" className="text-emerald-700 hover:text-emerald-800">
              Manage
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.last4}
                className="flex items-center justify-between rounded-lg border border-emerald-50 bg-emerald-50/40 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-emerald-700" />
                  <div className="text-sm">
                    <p className="font-semibold text-slate-900">
                      {method.brand} •••• {method.last4}
                    </p>
                    <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
                  </div>
                </div>
                {method.default && (
                  <Badge className="bg-emerald-600 text-white" variant="default">
                    Default
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-emerald-50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Invoices</CardTitle>
          <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700">
            Download all
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {invoices.map((invoice, idx) => (
            <div key={invoice.id}>
              <div className="flex flex-col gap-2 rounded-xl border border-emerald-50 bg-slate-50/70 px-3 py-2 text-sm text-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-inner">
                    <FileText className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{invoice.id}</p>
                    <p className="text-xs text-muted-foreground">{invoice.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
                    {invoice.status}
                  </Badge>
                  <span className="font-semibold text-slate-900">{invoice.amount}</span>
                  <Button variant="ghost" size="sm" className="gap-2 text-emerald-700 hover:text-emerald-800">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
              {idx < invoices.length - 1 && <Separator className="my-1" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
