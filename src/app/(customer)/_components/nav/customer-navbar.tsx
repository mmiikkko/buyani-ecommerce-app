"use client";

import Logo from "@/assets/logo/Logo.png";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import { UserDropdown } from "@/components/user-dropdown";
import { authClient } from "@/server/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Handshake,
  Home,
  MapPin,
  Package,
  ShoppingCart,
  Tag,
  UserIcon,
} from "lucide-react";

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className }: NavbarProps) {
  const session = authClient.useSession();

  const user = session.data?.user;
  const isLoading = session.isPending || session.isRefetching;
  const isAuthenticated = !!user;

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 border-b border-emerald-100/70 bg-white/70 backdrop-blur-xl shadow-sm",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-8">
        
        {/* Brand + primary links */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/60">
              <Image
                src={Logo}
                alt="Buyani logo"
                fill
                sizes="36px"
                className="object-contain p-1.5"
              />
            </div>

            <span className="hidden text-base font-semibold tracking-tight text-slate-900 sm:inline">
              Buyani
            </span>
            </Link>
            {/* Mobile Become a Seller link */}
            <Link
              href="/seller"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors sm:hidden"
            >
              <Handshake size={14} />
              <span>Become a seller</span>
            </Link>
          </div>

          <ul className="hidden items-center gap-5 text-sm font-medium text-slate-600 md:flex">
            <li>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100 bg-emerald-50/80"
              >
                <Home size={14} />
                <span>Home</span>
              </Link>
            </li>

            <li>
              <Link
                href="/shops"
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Package size={14} />
                <span>Shops</span>
              </Link>
            </li>

            <li>
              <Link
                href="/categories"
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Tag size={14} />
                <span>Categories</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Search + actions */}
        <div className="flex flex-1 items-center justify-end gap-3">

          <div className="hidden w-60 items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 shadow-xs sm:flex">
            <Input
              type="text"
              placeholder="Search local treats and shops…"
              className="h-7 border-0 bg-transparent px-0 text-xs placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <Link
            href="/seller"
            className="hidden items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors sm:inline-flex"
          >
            <Handshake size={14} />
            <span>Become a seller</span>
          </Link>

          <Button
            variant="outline"
            className="hidden h-8 items-center gap-1.5 rounded-full border-slate-200 text-xs text-slate-600 hover:bg-slate-50 sm:inline-flex"
          >
            <MapPin size={14} />
            <span>CNSC</span>
          </Button>

          <div className="flex items-center gap-2 text-slate-800">
            {isLoading ? (
              <Skeleton className="h-8 w-[96px] rounded-full" />

            ) : isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link href="/cart">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full border-slate-200 hover:bg-slate-50"
                  >
                    <ShoppingCart size={16} />
                  </Button>
                </Link>

                <UserDropdown user={user!} />
              </div>

            ) : (
              <Link href="/sign-in">
                <Button className="inline-flex h-8 items-center gap-1.5 rounded-full bg-slate-900 px-3 text-xs font-medium text-white hover:bg-slate-800">
                  <UserIcon size={14} />
                  <span>Log in</span>
                </Button>
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
