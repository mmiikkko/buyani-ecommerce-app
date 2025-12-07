"use client";

import { AdminCategories } from "../_components/admin-categories";
import { LandingCustom } from "../_components/landing-custom";

export default function SiteSettings() {
    return(
        <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-18 mx-3">
            <h1 className="text-xl font-bold mb-1 text-[#2E7D32]">
            Site Settings
            </h1>
            <p>Manage your site settings here </p>
            
            <div className="space-y-6">
                <AdminCategories />
                <LandingCustom />
            </div>
        </section>
    );
}