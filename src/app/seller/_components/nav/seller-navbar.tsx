"use client";

import Image from "next/image";
import { useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/assets/logo/Logo.png";
import logo from "@/assets/logo/RAES.jpg";
import LOGO from "@/assets/logo/LOGO.jpg";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLanguage } from "@/lib/i18n/context";

export default function ASNavbar({ children }: { children?: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  // 🔑 Auto-hide loader after navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);
  }, [pathname]);

  const navigateWithLoader = (href: string) => {
    setLoading(true);
    router.push(href);
  };

  return (
    <>
      {/* ✅ FULL PAGE LOADER */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <Spinner className="size-6 text-emerald-600" />
        </div>
      )}

      <nav className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between
                      bg-gradient-to-br from-emerald-50/90 via-slate-50/90 to-amber-50/90
                      backdrop-blur-xl shadow-md pl-3 pr-5">

        {/* Left */}
        <div className="flex items-center px-4 py-2">
          {children}

          <Image src={logo} alt="BuyAni Logo" width={38} height={38} className="rounded-md" />
          <Image src={LOGO} alt="BuyAni Logo" width={38} height={38} className="rounded-md" />
          <Image src={Logo} alt="BuyAni Logo" width={38} height={38} className="rounded-md" />

          <div className="ml-2 text-center">
            <div className="text-[#2E7D32]">BUYANI</div>
            <div className="text-xs text-[#6A7282]">{t("seller-center")}</div>
          </div>
        </div>

        {/* Right */}
        <div className="px-4 py-2">
          <Button
            onClick={() => navigateWithLoader("/")}
            className="flex items-center space-x-2 bg-white text-[#2E7D32]
                       border border-[#2E7D32] hover:bg-[#2E7D32] hover:text-white
                       hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Store size={16} />
            <span>{t("back-to-marketplace")}</span>
          </Button>
        </div>
      </nav>
    </>
  );
}
