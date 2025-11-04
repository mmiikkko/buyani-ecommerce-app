"use client";

import Link from "next/link";
import { ShoppingCart, User, Home, Store, Tag } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-500 via-yellow-400 to-orange-500 shadow-md">
      {/* Top row */}
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold">Buyani Ecommerce</span>
        </div>

        {/* Links */}
        <ul className="flex space-x-6 items-center text-sm font-medium">
          <li className="flex items-center space-x-1">
            <Home size={16} />
            <Link href="/">Home</Link>
          </li>
          <li className="flex items-center space-x-1">
            <Store size={16} />
            <Link href="/shop">Shop</Link>
          </li>
          <li className="flex items-center space-x-1">
            <Tag size={16} />
            <Link href="/categories">Categories</Link>
          </li>
          <li>
            <Link href="/seller-center">Seller Center</Link>
          </li>

          {/* Buttons */}
          <li>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md">
              Become a Seller
            </button>
          </li>
          <li>
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md">
              CNSC
            </button>
          </li>
          <li>
            <Link href="/orders">My Orders</Link>
          </li>

          {/* Icons */}
          <li>
            <ShoppingCart size={20} />
          </li>
          <li>
            <User size={20} />
          </li>
        </ul>
      </div>

      {/* Search bar row */}
      <div className="bg-white flex items-center mx-6 mb-3 rounded-md shadow-sm">
        <input
          type="text"
          placeholder="Search for products or vendors"
          className="flex-1 px-4 py-2 text-gray-700 rounded-md focus:outline-none"
        />
      </div>
    </nav>
  );
}
