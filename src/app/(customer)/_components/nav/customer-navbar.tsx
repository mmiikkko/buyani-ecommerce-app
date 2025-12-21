"use client";

import Logo from "@/assets/logo/Logo.png";
import LOGO from "@/assets/logo/LOGO.jpg";
import logo from "@/assets/logo/RAES.jpg";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

import { UserDropdown } from "@/components/user-dropdown";
import { authClient } from "@/server/auth-client";
import { USER_ROLES } from "@/server/schema/auth-schema";
import { LanguageSelector } from "@/components/language-selector";
import { useLanguage } from "@/lib/i18n/context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Grid3x3,
  Handshake,
  Home,
  Loader2,
  Package,
  Search,
  ShoppingCart,
  Tag,
  UserIcon,
  Menu
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className }: NavbarProps) {
  const session = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const { t } = useLanguage();

  const user = session.data?.user;
  const isLoading = session.isPending || session.isRefetching;
  const isAuthenticated = !!user;
  const [hasSuspendedShop, setHasSuspendedShop] = useState(false);
  const isSuspendedRole = user?.role === "suspended";
  const isSellerRole =
    user?.role === USER_ROLES.SELLER || user?.role === USER_ROLES.ADMIN;
  const isSeller = !isSuspendedRole && !hasSuspendedShop && isSellerRole;

  const navLinks = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/products", label: t("products"), icon: Grid3x3 },
    { href: "/shops", label: t("shops"), icon: Package },
    { href: "/categories", label: t("categories"), icon: Tag },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const navigateWithLoader = (href: string) => {
    setIsNavigating(true);
    router.push(href);
  };


  // Initialize search query from URL if on products page
  useEffect(() => {
    if (pathname === "/products") {
      const urlQuery = searchParams.get("search") || "";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchQuery(urlQuery);
    }
  }, [pathname, searchParams]);

  // Handle real-time search with debouncing
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Navigate to products page if not already there (immediately)
    if (pathname !== "/products") {
      if (value.trim()) {
        router.push(`/products?search=${encodeURIComponent(value.trim())}`);
      } else {
        router.push("/products");
      }
      return;
    }

    // Set new timer to update URL after user stops typing (if already on products page)
    debounceTimer.current = setTimeout(() => {
      if (value.trim()) {
        router.replace(`/products?search=${encodeURIComponent(value.trim())}`);
      } else {
        router.replace("/products");
      }
    }, 300); // 300ms debounce delay
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Clear debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    // Navigate immediately on form submit
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/products");
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Fetch cart count when user is authenticated
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCartCount(0);
      setHasSuspendedShop(false);
      return;
    }

    const fetchCartCount = async () => {
      try {
        const response = await fetch("/api/cart/count");
        if (response.ok) {
          const data = await response.json();
          setCartCount(data.count || 0);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount();

    // Refresh cart count periodically or on focus
    const interval = setInterval(fetchCartCount, 5000); // Check every 5 seconds
    const handleFocus = () => fetchCartCount();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isAuthenticated, user?.id]);

  // Refresh cart count when navigating to/from cart page
  useEffect(() => {
    if (isAuthenticated && user?.id && (pathname === "/cart" || pathname === "/")) {
      const fetchCartCount = async () => {
        try {
          const response = await fetch("/api/cart/count");
          if (response.ok) {
            const data = await response.json();
            setCartCount(data.count || 0);
          }
        } catch (error) {
          console.error("Error fetching cart count:", error);
        }
      };
      fetchCartCount();
    }
  }, [pathname, isAuthenticated, user?.id]);

  // Fetch shop status to detect suspended shops; show CTA if suspended
  useEffect(() => {
    let active = true;
    async function loadShopStatus() {
      if (!isAuthenticated) {
        if (active) setHasSuspendedShop(false);
        return;
      }
      try {
        const res = await fetch("/api/sellers/shop");
        if (!res.ok) return;
        const data = await res.json();
        const suspended = data?.shop?.status === "suspended";
        if (active) setHasSuspendedShop(Boolean(suspended));
      } catch {
        // ignore
      }
    }
    loadShopStatus();
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  // Reset navigation state when pathname changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsNavigating(false);
  }, [pathname]);

  return (
    <>
      {/* Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-8 shadow-2xl">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            <p className="text-sm font-medium text-slate-700">{t("loading")}</p>
          </div>
        </div>
      )}

      <nav
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 border-b border-emerald-100/70 bg-gradient-to-r from-emerald-50/95 via-white/90 to-amber-50/95 backdrop-blur-xl shadow-[0_12px_38px_rgba(16,38,68,0.08)]",
          className
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-8">

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-emerald-50 hover:text-emerald-600">
                  <Menu size={24} />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] max-w-[350px] flex flex-col p-0 border-r border-emerald-100 bg-white/95 backdrop-blur-xl">
                <SheetHeader className="px-6 on-top-6 pb-6 pt-12 bg-gradient-to-b from-emerald-50/80 to-transparent">
                  <SheetTitle className="flex items-center gap-3 text-2xl font-bold tracking-tight text-emerald-950">
                    <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm">
                      <Image src={Logo} alt="BuyAni" fill className="object-contain p-1.5" />
                    </div>
                    BuyAni
                  </SheetTitle>
                  <p className="text-xs font-medium text-emerald-600/80 uppercase tracking-widest pl-1">Marketplace</p>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-2">
                  {/* Mobile Search */}
                  <form onSubmit={(e) => {
                    handleSearch(e);
                  }} className="relative mb-8 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <Input
                      placeholder={t("search-placeholder")}
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="h-11 pl-10 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500 rounded-xl shadow-sm transition-all text-sm"
                    />
                  </form>

                  {/* Mobile Links */}
                  <div className="flex flex-col gap-1">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Navigation</h4>
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const active = isActive(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => {
                            setIsNavigating(true);
                            setIsMobileMenuOpen(false);
                          }}
                          className={clsx(
                            "flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200",
                            active
                              ? "bg-emerald-50 text-emerald-800 shadow-[0_2px_8px_rgba(16,185,129,0.08)] translate-x-1"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1"
                          )}
                        >
                          <Icon size={18} className={clsx(active ? "text-emerald-600" : "text-slate-400")} />
                          {link.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-auto border-t border-slate-100 bg-slate-50/50 p-6">
                  {!isAuthenticated ? (
                    <div className="flex flex-col gap-3">
                      <Link href="/sign-in" className="w-full" onClick={() => { navigateWithLoader("/sign-in"); setIsMobileMenuOpen(false); }}>
                        <Button className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 font-semibold">{t("login")}</Button>
                      </Link>
                      <Link href="/sign-up" className="w-full" onClick={() => { navigateWithLoader("/sign-up"); setIsMobileMenuOpen(false); }}>
                        <Button variant="outline" className="w-full h-11 rounded-xl border-slate-200 font-semibold text-slate-700">{t("create-account")}</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                      <UserDropdown user={user!} />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-slate-900 truncate">{user!.name}</span>
                        <span className="text-xs text-slate-500 truncate max-w-[150px]">{user!.email}</span>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Brand + primary links */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/60">
                  <Image
                    src={logo}
                    alt="CNSC"
                    fill
                    sizes="36px"
                    className="object-contain p-1.5"
                  />
                </div>
                <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/60">
                  <Image
                    src={LOGO}
                    alt="CNSC"
                    fill
                    sizes="36px"
                    className="object-contain p-1.5"
                  />
                </div>

                <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/60">
                  <Image
                    src={Logo}
                    alt="BuyAni logo"
                    fill
                    sizes="36px"
                    className="object-contain p-1.5"
                  />
                </div>

                <span className="hidden text-base font-semibold tracking-tight text-slate-900 sm:inline">
                  BuyAni
                </span>
              </Link>
              {/* Mobile Become a Seller link */}
              {!isSeller && (
                <Link
                  href="/become-seller"
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors sm:hidden"
                >
                  <Handshake size={14} />
                  <span>{t("become-seller")}</span>
                </Link>
              )}
            </div>

            <ul className="hidden items-center gap-2 text-sm font-medium text-slate-600 md:flex">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={clsx(
                        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.75 text-xs transition-all duration-200",
                        "border border-transparent bg-white/60 text-slate-600 shadow-[0_4px_12px_rgba(15,23,42,0.06)] hover:-translate-y-[1px] hover:border-emerald-100 hover:bg-white",
                        active && "border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 shadow-[0_6px_16px_rgba(16,185,129,0.18)]"
                      )}
                    >
                      <Icon size={14} />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Search + actions */}
          <div className="flex flex-1 items-center justify-end gap-3">

            <form onSubmit={handleSearch} className="hidden w-64 items-center gap-2 rounded-full border border-emerald-100 bg-white/85 px-3.5 py-1.75 shadow-[0_6px_18px_rgba(16,38,68,0.06)] ring-1 ring-emerald-50 sm:flex">
              <Search size={14} className="text-slate-400 flex-shrink-0" />
              <Input
                type="text"
                placeholder={t("search-placeholder")}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-7 border-0 bg-transparent px-0 text-xs placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </form>

            {!isSeller && (
              <Link
                href="/become-seller"
                className="hidden items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors sm:inline-flex"
              >
                <Handshake size={14} />
                <span>{t("become-seller")}</span>
              </Link>
            )}

            <LanguageSelector />

            <div className="flex items-center gap-2 text-slate-800">
              {isLoading ? (
                <Skeleton className="h-8 w-[96px] rounded-full" />

              ) : isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-full border-slate-200 px-3 text-xs font-medium"
                    onClick={() => navigateWithLoader("/orders")}
                  >
                    {t("orders")}
                  </Button>


                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full border-slate-200 relative"
                    onClick={() => navigateWithLoader("/cart")}
                  >
                    <ShoppingCart size={16} />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 ...">
                        {cartCount > 99 ? "99+" : cartCount}
                      </Badge>
                    )}
                  </Button>

                  <div className="hidden md:block">
                    <UserDropdown user={user!} />
                  </div>
                </div>

              ) : (
                <Link href="/sign-in">
                  <Button className="inline-flex h-8 items-center gap-1.5 rounded-full bg-slate-900 px-3 text-xs font-medium text-white hover:bg-slate-800">
                    <UserIcon size={14} />
                    <span>{t("login")}</span>
                  </Button>
                </Link>
              )}
            </div>

          </div>
        </div>
      </nav>
    </>
  );
}
