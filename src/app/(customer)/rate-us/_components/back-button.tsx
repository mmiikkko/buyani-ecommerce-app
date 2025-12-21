"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";

export function BackButton() {
    const router = useRouter();
    const { t } = useLanguage();

    return (
        <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-8 h-10 px-4 rounded-full border border-emerald-100 bg-white shadow-sm hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all duration-200 flex items-center gap-2 group"
        >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">{t("back")}</span>
        </Button>
    );
}
