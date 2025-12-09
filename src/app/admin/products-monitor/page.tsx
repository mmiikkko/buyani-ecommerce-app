"use client";
import { AdminProducts } from "../_components/admin-products";
import { Package } from "lucide-react";

export default function ProductsMonitor() {
    return (
        <section className="relative min-h-screen min-w-full overflow-hidden space-y-6 pt-15">
            <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-xl p-6 border border-emerald-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-600 rounded-lg shadow-md">
                        <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">
                            Products Management
                        </h1>
                        <p className="text-sm text-gray-600">
                            Monitor and manage all products listed by sellers
                        </p>
                    </div>
                </div>
            </div>

            <AdminProducts />
        </section>
    );
}