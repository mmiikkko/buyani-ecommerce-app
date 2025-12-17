"use-client";

import { CalendarSync } from "lucide-react";

export default function MonthlyDuesPage() {
    return(
        <section className="relative min-h-screen min-w-full overflow-hidden space-y-6 ml-5 mr-5 w-full flex flex-col pr-8 pb-8">
            {/* Header Section */}
            <div className="space-y-2 mb-4">
            <h1 className="text-3xl font-bold text-[#2E7D32] flex items-center gap-3">
            <CalendarSync className="h-8 w-8" />
                Monthly Dues
            </h1>
              <p className="text-muted-foreground text-sm">
                Monthly dues overview and management.
              </p>
            </div>
        </section>
    );
}