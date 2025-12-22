"use client";

import { Store } from "lucide-react";
import  AdminSalesTrends from "../_components/admin-sales-trends";

export default function SalesTrend(){
    return(
        <section className="relative min-h-screen min-w-full overflow-hidden space-y-6">
        <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-xl p-6 border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-4">
        </div>
        <AdminSalesTrends />
        </div>
</section>
    );
}

