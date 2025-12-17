"use client";

import { User } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export function ProfileSettingsHeader() {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-[#2E7D32]/10">
          <User className="h-6 w-6 text-[#2E7D32]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("profile-settings")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("profile-settings-desc")}
          </p>
        </div>
      </div>
    </div>
  );
}

