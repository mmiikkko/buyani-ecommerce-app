"use client";

import Logo from "@/assets/logo/Logo.png";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, FormEvent, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";

import { UserDropdown } from "@/components/user-dropdown";
import { authClient } from "@/server/auth-client";
import { USER_ROLES } from "@/server/schema/auth-schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Grid3x3,
  Handshake,
  Home,
  MapPin,
  Package,
  Search,
  ShoppingCart,
  Tag,
  UserIcon,
} from "lucide-react";

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
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const user = session.data?.user;
  const isLoading = session.isPending || session.isRefetching;
  const isAuthenticated = !!user;
  const isSeller = user?.role?.includes(USER_ROLES.SELLER) ?? false;

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

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 border-b border-emerald-100/70 bg-gradient-to-br from-emerald-50/90 via-slate-50/90 to-amber-50/90 backdrop-blur-xl shadow-sm",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-8">
        
        {/* Brand + primary links */}
        <div className="flex items-center gap-4">
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
            {!isSeller && (
              <Link
                href="/become-seller"
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors sm:hidden"
              >
                <Handshake size={14} />
                <span>Become a seller</span>
              </Link>
            )}
          </div>

          <ul className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <li>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate-600 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-sm"
              >
                <Home size={14} />
                <span>Home</span>
              </Link>
            </li>

            <li>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate-600 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-sm"
              >
                <Grid3x3 size={14} />
                <span>Products</span>
              </Link>
            </li>

            <li>
              <Link
                href="/shops"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate-600 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-sm"
              >
                <Package size={14} />
                <span>Shops</span>
              </Link>
            </li>

            <li>
              <Link
                href="/categories"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate-600 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-sm"
              >
                <Tag size={14} />
                <span>Categories</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Search + actions */}
        <div className="flex flex-1 items-center justify-end gap-3">

          <form onSubmit={handleSearch} className="hidden w-60 items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 shadow-xs sm:flex">
            <Search size={14} className="text-slate-400 flex-shrink-0" />
            <Input
              type="text"
              placeholder="Search local treats and shops…"
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
              <span>Become a seller</span>
            </Link>
          )}


          <div className="flex items-center gap-2 text-slate-800">
            {isLoading ? (
              <Skeleton className="h-8 w-[96px] rounded-full" />

            ) : isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link href="/cart" className="relative">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full border-slate-200 hover:bg-slate-50 relative"
                  >
                    <ShoppingCart size={16} />
                    {cartCount > 0 && (
                      <Badge 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-emerald-600 text-white text-[10px] font-bold border-2 border-white rounded-full"
                      >
                        {cartCount > 99 ? "99+" : cartCount}
                      </Badge>
                    )}
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
