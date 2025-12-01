import Logo from "@/assets/logo/Logo.png";
import {
  ChevronDown,
  Facebook,
  MapPin,
  Phone,
  ShieldCheck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
                <span>CNSC Main Campus, Daet</span>
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
            </ul>
          </div>

          {/* Stay Updated */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-sm text-green-100">
              Subscribe to get special offers, free giveaways, and updates.
            </p>
            <div className="flex gap-2">
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
