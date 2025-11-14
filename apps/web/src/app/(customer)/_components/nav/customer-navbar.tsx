"use client";

import Logo from "@/assets/logo/Logo.png";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import { UserDropdown } from "@/components/user-dropdown";
import { authClient } from "@/server/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Package, Home, Handshake, Tag, UserIcon } from "lucide-react";

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
        "fixed top-0 left-0 right-0 z-50 rounded-b-sm bg-opacity-95 backdrop-blur-sm shadow-md border-b border-black/10",
        className
      )}
      style={{
        background:
          "linear-gradient(to right, #5EA162 0%, #84BA75 15%, #DCB680 87%, #FFBC89 100%)",
      }}
    >
      <div className="flex items-center justify-center w-full px-10 md:px-20 py-4">
        <div className="flex w-full md:w-3/4 space-between space-x-8">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={Logo}
                alt="BuyAni Logo"
                width={120}
                height={120}
                className="rounded-md"
              />
            </Link>
          </div>

          {/* Middle Section */}
          <div className="w-full flex flex-col space-between mt-2">
            <div className="flex justify-between">
              <ul className="flex space-x-8 items-center text-sm font-medium ">
                <li className="flex items-center space-x-2 transition">
                  <Home size={16} />
                  <Link href="/">Home</Link>
                </li>
                <li className="flex items-center space-x-4 transition">
                  <Package size={16} />
                  <Link href="/shops">Shops</Link>
                </li>
                <li className="flex items-center space-x-2 transition">
                  <Tag size={16} />
                  <Link href="/categories">Categories</Link>
                </li>
              </ul>

              <div className="flex items-center space-x-3">
                <Button className="bg-secondary">
                  <Handshake />
                  <span>Become a Seller</span>
                </Button>
                <Button variant="outline">
                  <MapPin />
                  <span>CNSC</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between space-x-4 mt-auto">
              <Input
                type="text"
                placeholder="Search for products or vendors"
                className="flex-1  bg-white"
              />
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-end space-x-4 text-black">
            {isLoading ? (
              <Skeleton className="h-9 w-[100px] rounded-md" />
            ) : isAuthenticated ? (
              <UserDropdown user={user!} />
            ) : (
              <Link href="/sign-in" className="text-sm font-medium">
                <Button className="flex items-center space-x-2 ">
                  <UserIcon />
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
