"use client";

import { AdminCategories } from "../_components/admin-categories";
import { LandingCustom } from "../_components/landing-custom";
import { Settings } from "lucide-react";

export default function SiteSettings() {
    return(
        <section className="relative min-h-screen min-w-full overflow-hidden space-y-6 pt-15">
            <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-xl p-6 border border-emerald-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-600 rounded-lg shadow-md">
                        <Settings className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">
                            Site Settings
                        </h1>
                        <p className="text-sm text-gray-600">
                            Manage categories, landing page, and site configuration
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="space-y-6">
                <AdminCategories />
                <LandingCustom />
            </div>
        </section>
    );
}