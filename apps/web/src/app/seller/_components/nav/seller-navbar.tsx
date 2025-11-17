"use-client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logo/Logo.png";
import { Store } from "lucide-react";
import { Button } from "../../../../components/ui/button";

export default function ASNavbar() {
  return (
    <nav className="flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-md h-16 bg-white pl-5 pr-5">
      {/* Left side */}
      <div className="flex items-center px-4 py-2 bg-white">
        <Image
          src={Logo}
          alt="BuyAni Logo"
          width={38}
          height={38}
          className="rounded-md"
        />

        <div className="flex flex-col items-center ml-2">
          <div className="text-[#2E7D32] mb-0 text-center">BUYANI</div>
          <div className="text-[#6A7282] text-xs mt-0 text-center">
            Seller Center
          </div>
        </div>
      </div>

      {/* Right side*/}
      <div className="flex items-center px-4 py-2 bg-white">
        <ul>
          <li>
            <Button
              className="flex items-center space-x-1 bg-white text-[#2E7D32] 
                        border border-[#2E7D32] hover:bg-[#2E7D32] hover:text-white 
                        transition px-3 py-2 rounded-md cursor-pointer"
            >
              <Store size={16} />
              <Link href={"/"}>Back to Marketplace</Link>
            </Button>
          </li>

          <li>
            <div className="flex flex-col items-center"></div>
          </li>
        </ul>
      </div>
    </nav>
  );
}
