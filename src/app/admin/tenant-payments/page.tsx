"use client";

import { useState, useEffect } from "react";
import { CalendarSync, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NextResponse } from "next/server";
import { db } from "@/server/drizzle";

//export async function GET() {
  //const data = await db.query.tenantBilling.findMany();
  //return NextResponse.json(data);
//}

// Types
type TenantBilling = {
  id: string;
  tenantId: string;
  billingMonth: string;
  amountDue: number;
  dueDate: string;
  status: "unpaid" | "pending_verification" | "paid" | "rejected";
};

const fetchTenantBilling = async (): Promise<TenantBilling[]> => {
  const res = await fetch("/api/admin/tenant-billing");
  if (!res.ok) throw new Error("Failed to fetch billing");
  return res.json();
};


export default function TenantPaymentsPage() {
  const [billings, setBillings] = useState<TenantBilling[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchTenantBilling();
      setBillings(data);
    };
    loadData();
  }, []);

  // Filtered billings by search term
  const filteredBillings = billings.filter((billing) => {
    const term = search.toLowerCase();
    return (
      billing.tenantId.toLowerCase().includes(term) ||
      billing.billingMonth.toLowerCase().includes(term) ||
      billing.status.toLowerCase().includes(term)
    );
  });

  return (
    <section className="relative min-h-screen min-w-full overflow-hidden space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-xl p-6 border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-600 rounded-lg shadow-md">
            <CalendarSync className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Tenant Payments</h1>
            <p className="text-sm text-gray-600">Manage tenants, payment dues, and tenant details.</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-gray-500" />
        <Input
          placeholder="Search by tenant ID, month, or status"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Billing Table */}
      <div className="overflow-x-auto">
        <Table className="w-full bg-white rounded-xl border border-gray-200">
          <TableHeader>
            <TableRow>
              <TableHead>Tenant ID</TableHead>
              <TableHead>Billing Month</TableHead>
              <TableHead>Amount Due</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBillings.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                  No tenants found.
                </TableCell>
              </TableRow>
            )}
            {filteredBillings.map((billing) => (
              <TableRow key={billing.id}>
                <TableCell>{billing.tenantId}</TableCell>
                <TableCell>{billing.billingMonth}</TableCell>
                <TableCell>₱{billing.amountDue.toLocaleString()}</TableCell>
                <TableCell>{new Date(billing.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-lg text-sm font-medium ${
                      billing.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : billing.status === "pending_verification"
                        ? "bg-yellow-100 text-yellow-700"
                        : billing.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {billing.status}
                  </span>
                </TableCell>
                <TableCell>
                  {billing.status === "unpaid" && (
                    <Button size="sm" variant="outline">
                      Upload Payment
                    </Button>
                  )}
                  {billing.status === "pending_verification" && (
                    <span className="text-sm text-gray-500">Awaiting Verification</span>
                  )}
                  {billing.status === "paid" && (
                    <span className="text-sm text-green-600 font-semibold">Paid</span>
                  )}
                  {billing.status === "rejected" && (
                    <span className="text-sm text-red-600 font-semibold">Rejected</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
