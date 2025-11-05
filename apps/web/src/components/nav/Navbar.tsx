"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, User, Home, Store, Tag } from "lucide-react";
import Logo from "@/assets/logo/Logo.png";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-linear-to-r from-green-300 via-yellow-400 to-orange-400 rounded-b-sm shadow-lg">
      {/* === MAIN CONTAINER === */}
      <div className="flex items-center justify-center w-full px-10 md:px-20 py-4 ">
        {/* === LEFT SIDE (Logo) === */}

        {/* === RIGHT SIDE === */}
        <div className="flex w-full md:w-3/4">
          <div className="flex items-center mr-15">
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
              <ul className="flex space-x-8 items-center text-sm font-medium text-black">
                <li className="flex items-center space-x-1 hover:text-white transition">
                  <Home size={16} />
                  <Link href="/">Home</Link>
                </li>
                <li className="flex items-center space-x-1 hover:text-white transition">
                  <Store size={16} />
                  <Link href="/shops">Shops</Link>
                </li>
                <li className="flex items-center space-x-1 hover:text-white transition">
                  <Tag size={16} />
                  <Link href="/categories">Categories</Link>
                </li>
                <li className="hover:text-white transition">
                  <Link href="/seller">Seller Center</Link>
                </li>
              </ul>

              <div className="flex items-center space-x-3">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 rounded-md text-sm transition p-2">
                  Become a Seller
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition">
                  CNSC
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between space-x-4 mt-auto">
              {/* Search bar */}
              <input
                type="text"
                placeholder="Search for products or vendors"
                className="flex-1 px-4 py-3 text-gray-700 rounded-xl shadow-sm focus:outline-none bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
