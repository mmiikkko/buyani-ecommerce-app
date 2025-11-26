import { ArrowRight, Heart, Star, CheckCircle, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FeaturedVendor {
  id: string;
  name: string;
  category: string;
  categoryColor: string;
  rating: number;
  products: number;
  followers: number;
  isVerified: boolean;
  image: string;
  href: string;
}

const FEATURED_VENDORS: FeaturedVendor[] = [
  {
    id: "FV001",
    name: "Featured Vendor One",
    category: "Produce",
    categoryColor: "bg-orange-100 text-orange-700 border-orange-200",
    rating: 0.0,
    products: 0,
    followers: 0,
    isVerified: true,
    image: "/api/placeholder/300/200",
    href: "/vendors/featured-vendor-one",
  },
  {
    id: "FV002",
    name: "Featured Vendor Two",
    category: "Crafts",
    categoryColor: "bg-blue-100 text-blue-700 border-blue-200",
    rating: 0.0,
    products: 0,
    followers: 0,
    isVerified: true,
    image: "/api/placeholder/300/200",
    href: "/vendors/featured-vendor-two",
  },
  {
    id: "FV003",
    name: "Featured Vendor Three",
    category: "Produce",
    categoryColor: "bg-orange-100 text-orange-700 border-orange-200",
    rating: 0.0,
    products: 0,
    followers: 0,
    isVerified: true,
    image: "/api/placeholder/300/200",
    href: "/vendors/featured-vendor-three",
  },
  {
    id: "FV004",
    name: "Featured Vendor Four",
    category: "Snacks",
    categoryColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
    rating: 0.0,
    products: 0,
    followers: 0,
    isVerified: false,
    image: "/api/placeholder/300/200",
    href: "vendors/featured-vendor-four",
  },
  {
    id: "FB005",
    name: "Featured Vendor Five",
    category: "Crafts",
    categoryColor: "bg-blue-100 text-blue-700 border-blue-200",
    rating: 0.0,
    products: 0,
    followers: 0,
    isVerified: true,
    image: "/api/placeholder/300/200",
    href: "/vendors/featured-vendor-five",
  },
  {
    id: "FB006",
    name: "Featured Vendor Six",
    category: "Drinks",
    categoryColor: "bg-purple-100 text-purple-700 border-purple-200",
    rating: 0.0,
    products: 0,
    followers: 0,
    isVerified: true,
    image: "/api/placeholder/300/200",
    href: "/vendors/featured-vendor-six",
  },
];

export function FeaturedVendorsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-slate-50/50 to-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Featured Vendors
            </h2>
            <p className="text-sm text-slate-600">
              Meet our top-rated local farmers and sellers
            </p>
          </div>

          <Link
            href="/customer/vendors"
            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            View All
            <ArrowRight className="size-4" />
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURED_VENDORS.map((vendor) => (
            <div
              key={vendor.id}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100"
            >
              {/* Favorite Button */}
              <button className="absolute cursor-pointer top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors duration-200">
                <Heart className="size-4 text-slate-400 hover:text-red-500" />
              </button>

              {/* Category Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${vendor.categoryColor}`}
                >
                  {vendor.category}
                </span>
              </div>

              {/* Vendor Image */}
              <Link href={vendor.href} className="block">
                <div className="aspect-[3/2] bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden relative">
                  <Image
                    src={vendor.image}
                    alt={vendor.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Verified Badge */}
                  {vendor.isVerified && (
                    <div className="absolute bottom-4 right-4">
                      <div className="flex items-center gap-1 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        <CheckCircle className="size-3 fill-white" />
                        Verified
                      </div>
                    </div>
                  )}
                </div>
              </Link>

              {/* Vendor Details */}
              <div className="p-6 space-y-4">
                {/* Vendor Name */}
                <Link href={vendor.href}>
                  <h3 className="font-bold text-slate-800 hover:text-emerald-600 transition-colors duration-200 line-clamp-2 text-lg">
                    {vendor.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-slate-800">
                      {vendor.rating}
                    </span>
                  </div>
                  <span className="text-sm text-slate-500">Rating</span>
                </div>

                {/* Statistics */}
                <div className="flex items-center justify-between text-center">
                  <div>
                    <div className="font-bold text-slate-800 text-lg">
                      {vendor.products}
                    </div>
                    <div className="text-xs text-slate-500">Products</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-lg">
                      {vendor.followers >= 1000 
                        ? `${(vendor.followers / 1000).toFixed(1)}k`
                        : vendor.followers
                      }
                    </div>
                    <div className="text-xs text-slate-500">Followers</div>
                  </div>
                </div>

                {/* Visit Store Button */}
                <Link href={vendor.href} className="block">
                  <button className="w-full cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2">
                    <Store className="size-4" />
                    Visit Store
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}