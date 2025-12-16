"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Logo from "@/assets/logo/Logo.png";
import logo from "@/assets/logo/RAES.jpg";
import LOGO from "@/assets/logo/LOGO.jpg";
import { Store } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { ReactNode } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function ASNavbar({ children }: { children?: ReactNode }) {
  const [loading, setLoading] = useState(false);

  return (
    <nav className="relative flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-md h-16 bg-gradient-to-br from-emerald-50/90 via-slate-50/90 to-amber-50/90 backdrop-blur-xl pl-3 pr-5">
      
      {/* PAGE LOADER */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <Spinner className="size-5" />
        </div>
      )}

      {/* Left side */}
      <div className={`flex items-center px-4 py-2 bg-transparent ${loading ? "pointer-events-none" : ""}`}>
        {children}

        <Image src={logo} alt="BuyAni Logo" width={38} height={38} className="rounded-md" />
        <Image src={LOGO} alt="BuyAni Logo" width={38} height={38} className="rounded-md" />
        <Image src={Logo} alt="BuyAni Logo" width={38} height={38} className="rounded-md" />

        <div className="flex flex-col items-center ml-2">
          <div className="text-[#2E7D32] mb-0 text-center">BUYANI</div>
          <div className="text-[#6A7282] text-xs mt-0 text-center">
            Seller Center
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className={`flex items-center px-4 py-2 bg-transparent ${loading ? "pointer-events-none" : ""}`}>
        <Button
          onClick={() => setLoading(true)}
          className="flex items-center space-x-1 bg-white text-[#2E7D32] 
                     border border-[#2E7D32] hover:bg-[#2E7D32] hover:text-white 
                     transition px-3 py-2 rounded-md cursor-pointer"
        >
          <Store size={16} />
          <Link href="/">Back to Marketplace</Link>
        </Button>
      </div>
    </nav>
  );
}
