"use client";

import Image from "next/image";
import Backdrop from "@/assets/customer/backdrop.png";

export function SingleBanner() {
  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-1 sm:px-6 lg:px-8">
        <div className="relative w-full overflow-hidden rounded-xl">
          <div className="relative aspect-[16/4] sm:aspect-[16/3]">
            <Image
              src={Backdrop}
              alt="Promotional banner"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

