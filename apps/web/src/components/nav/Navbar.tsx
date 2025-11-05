"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, ShoppingCart, Home, Store, Tag, UserIcon } from "lucide-react";
import Logo from "@/assets/logo/Logo.png";
import { UserDropdown } from "./user-dropdown";
import { authClient } from "@/server/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

export default function Navbar() {
  const session = authClient.useSession();
  const user = session.data?.user;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 rounded-sm bg-linear-to-r from-[#77ce86] via-[#c0ac76] to-[#d89a67] bg-opacity-95 backdrop-blur-sm shadow-md border-b border-black/10"
      style={{ filter: "saturate(0.85)" }}
    >
      {/* === MAIN CONTAINER === */}
      <div className="flex items-center justify-center w-full px-10 md:px-20 py-4 ">
        <div className="flex w-full md:w-3/4 space-between space-x-8">
          <div className="flex items-center ">
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

          <div className="w-full flex flex-col space-between mt-2">
            <div className="flex justify-between">
              {/* Navigation Links */}
              <ul className="flex space-x-8 items-center text-sm font-medium text-secondary">
                <li className="flex items-center space-x-4  transition">
                  <Home size={16} />
                  <Link href="/">Home</Link>
                </li>
                <li className="flex items-center space-x-4 transition">
                  <Store size={16} />
                  <Link href="/shop">Shop</Link>
                </li>
                <li className="flex items-center space-x-4 transition">
                  <Tag size={16} />
                  <Link href="/categories">Categories</Link>
                </li>
                <li>
                  <Link href="/seller-center">Seller Center</Link>
                </li>
              </ul>

              <div className="flex items-center space-x-3">
                <Button className="">Become a Seller</Button>
                <Button className="">
                  CNSC <MapPin />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between space-x-4 mt-auto">
              {/* Search bar */}
              <Input
                type="text"
                placeholder="Search for products or vendors"
                className="flex-1 p-4 text-gray-700  shadow-sm focus:outline-none bg-white"
              />
            </div>
          </div>

          <div className="flex items-end space-x-4 text-black">
            {user ? (
              <UserDropdown user={user} />
            ) : (
              // If no user, show login button (or SignInFirstModal)
              <Link href="/sign-in" className="text-sm font-medium ">
                <Button>
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
