"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, User, Home, Store, Tag } from "lucide-react";
import Logo from "../../assets/logo/Logo.png";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-500 via-yellow-400 to-orange-500 rounded-b-2xl shadow-lg">
      {/* === MAIN CONTAINER === */}
      <div className="flex items-center justify-center w-full px-10 md:px-20 py-3 ">
        
        {/* === LEFT SIDE (Logo) === */}
        <div className="flex items-center mr-15">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={Logo}
              alt="BuyAni Logo"
              width={70}
              height={70}
              className="rounded-md"
            />
          </Link>
        </div>

        {/* === RIGHT SIDE === */}
        <div className="flex flex-col justify-between w-full md:w-3/4 space-y-3">
          
          {/* --- TOP SECTION: Links + Buttons --- */}
          <div className="flex items-center justify-between">
            {/* Navigation Links */}
            <ul className="flex space-x-6 items-center text-sm font-medium text-black">
              <li className="flex items-center space-x-1 hover:text-white transition">
                <Home size={16} />
                <Link href="/">Home</Link>
              </li>
              <li className="flex items-center space-x-1 hover:text-white transition">
                <Store size={16} />
                <Link href="/shop">Shop</Link>
              </li>
              <li className="flex items-center space-x-1 hover:text-white transition">
                <Tag size={16} />
                <Link href="/categories">Categories</Link>
              </li>
              <li className="hover:text-white transition">
                <Link href="/seller-center">Seller Center</Link>
              </li>
            </ul>

            {/* Buttons */}
            <div className="flex items-center space-x-3">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-sm transition">
                Become a Seller
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition">
                CNSC
              </button>
            </div>
          </div>

          {/* --- BOTTOM SECTION: Search Bar + Icons --- */}
          <div className="flex items-center justify-between space-x-4">
            {/* Search bar */}
            <input
              type="text"
              placeholder="Search for products or vendors"
              className="flex-1 px-4 py-2 text-gray-700 rounded-md shadow-sm focus:outline-none bg-white"
            />

            {/* Icons beside search bar */}
            <div className="flex items-center space-x-4 text-black">
              <ShoppingCart
                size={22}
                className="cursor-pointer hover:text-white transition"
              />
              <User
                size={22}
                className="cursor-pointer hover:text-white transition"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
