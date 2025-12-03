import Logo from "@/assets/logo/Logo.png";
import { Facebook, MapPin, Phone, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-emerald-900/40 bg-gradient-to-b from-slate-950 via-slate-950 to-emerald-950 text-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))]">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-emerald-400/60 bg-emerald-500/40">
                <Image
                  src={Logo}
                  alt="Buyani logo"
                  fill
                  sizes="36px"
                  className="object-contain p-1.5"
                />
              </div>
              <span className="text-base font-semibold tracking-tight text-slate-50">
                Buyani
              </span>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-slate-300/90">
              A calm, campus-first marketplace connecting CNSC students and
              local makers. Discover snacks, crafts, and essentials without
              the clutter.
            </p>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-emerald-300" />
                <span>CNSC Main Campus, Daet</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-300" />
                <span>+63 123 456 7890</span>
              </div>
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Explore
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white hover:underline hover:underline-offset-4"
                >
                  About Buyani
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-white hover:underline hover:underline-offset-4"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  href="/seller-center"
                  className="hover:text-white hover:underline hover:underline-offset-4"
                >
                  Become a seller
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="hover:text-white hover:underline hover:underline-offset-4"
                >
                  Help center
                </Link>
              </li>
            </ul>
          </div>

          {/* Stay connected */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Stay connected
            </h3>
            <p className="text-xs text-slate-300">
              Get small updates on new stalls, drops, and campus events.
            </p>
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-200">Follow us</p>
              <Link
                href="#"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-300/60 bg-emerald-500/30 text-slate-50 transition-colors hover:border-emerald-200 hover:bg-emerald-500/60"
              >
                <Facebook className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-emerald-800/60 bg-slate-950/90">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <p className="text-[11px] text-slate-400">
              © 2025 Buyani · CNSC University Market Hub.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              <span>Trusted campus marketplace</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
