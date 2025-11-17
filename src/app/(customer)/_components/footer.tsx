import {
  MapPin,
  Phone,
  Facebook,
  Mail,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logo/Logo.png";

export function Footer() {
  return (
    <footer className="bg-green-800 text-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image src={Logo} alt="Buyani Logo" width={40} height={40} />
              <span className="text-xl font-bold">BUYANI</span>
            </div>
            <p className="text-sm text-green-100">
              Your trusted marketplace for local products at CNSC. Supporting
              local vendors and building community through commerce.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-green-100">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>CNSC Campus, Daet</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-100">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+63 123 456 7890</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="flex items-center gap-2 text-sm text-green-100 hover:text-white transition-colors"
                >
                  <ChevronDown className="h-4 w-4" /> About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="flex items-center gap-2 text-sm text-green-100 hover:text-white transition-colors"
                >
                  <ChevronDown className="h-4 w-4" /> How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/seller-center"
                  className="flex items-center gap-2 text-sm text-green-100 hover:text-white transition-colors"
                >
                  <ChevronDown className="h-4 w-4" /> Seller Center
                </Link>
              </li>
              <li>
                <Link
                  href="/flash-deals"
                  className="flex items-center gap-2 text-sm text-green-100 hover:text-white transition-colors"
                >
                  <ChevronDown className="h-4 w-4" /> Flash Deals
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="flex items-center gap-2 text-sm text-green-100 hover:text-white transition-colors"
                >
                  <ChevronDown className="h-4 w-4" /> Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Care</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="flex items-center gap-2 text-sm text-green-100 hover:text-white transition-colors"
                >
                  <ChevronDown className="h-4 w-4" /> Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="flex items-center gap-2 text-sm text-green-100 hover:text-white transition-colors"
                >
                  <ChevronDown className="h-4 w-4" /> Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="flex items-center gap-2 text-sm text-green-100 hover:text-white transition-colors"
                >
                  <ChevronDown className="h-4 w-4" /> Shipping Information
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="flex items-center gap-2 text-sm text-green-100 hover:text-white transition-colors"
                >
                  <ChevronDown className="h-4 w-4" /> Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="flex items-center gap-2 text-sm text-green-100 hover:text-white transition-colors"
                >
                  <ChevronDown className="h-4 w-4" /> Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Stay Updated */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-sm text-green-100">
              Subscribe to get special offers, free giveaways, and updates.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-lg border border-green-600 bg-green-700 px-3 py-2 text-sm text-white placeholder-green-200 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors">
                <Mail className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Follow Us:</p>
              <Link
                href="#"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-700 hover:bg-green-600 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Payment and Delivery Section */}
        <div className="mt-12 border-t border-green-700 pt-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Payment Methods */}
            <div className="space-y-2">
              <p className="text-sm font-medium">We Accept:</p>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white px-3 py-1 text-gray-800">
                  <span className="text-xs font-semibold">GCash</span>
                </div>
                <div className="rounded-lg bg-white px-3 py-1 text-gray-800">
                  <span className="text-xs font-semibold">PayMaya</span>
                </div>
                <div className="rounded-lg bg-white px-3 py-1 text-gray-800">
                  <span className="text-xs font-semibold">COD</span>
                </div>
              </div>
            </div>

            {/* Delivery Partners */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Delivery Partners:</p>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white px-3 py-1 text-gray-800">
                  <span className="text-xs font-semibold">Pickup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-green-700 bg-green-900">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-green-200">
              © 2025 Buyani - CNSC University Market Hub. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-green-200">
                Trusted Campus Marketplace
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
