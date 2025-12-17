"use client";
import { CalendarSync } from "lucide-react";

export default function TenantPaymentsPage() {
    return (
        <section className="relative min-h-screen min-w-full overflow-hidden space-y-6">
            <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-xl p-6 border border-emerald-100 shadow-sm">
                <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-600 rounded-lg shadow-md">
                    <CalendarSync className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    Tenant Payments
                    </h1>
                    <p className="text-sm text-gray-600">
                    Manage tenants, payment dues, and tenant details.
                    </p>
                </div>
                </div>
            </div>
        </section>
    );
}