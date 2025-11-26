import { ArrowRight, Heart, Star } from "lucide-react";
import Link from "next/link";

interface BestSellerProduct {
  id: string;
  name: string;
  vendor: {
    name: string;
    icon: string;
  };
  price: number;
  rating: number;
  soldCount: number;
  image: string;
  href: string;
}

const BEST_SELLER_PRODUCTS: BestSellerProduct[] = [
  {
    id: "PlaceHolder Text1",
    name: "PlaceHolder Text",
    vendor: {
      name: "Nameless Vendor",
      icon: "👵",
    },
    price: 0,
    rating: 0,
    soldCount: 0,
    image: "",
    href: "/products/dried-pineapple",
  },
  {
    id: "PlaceHolder Text2",
    name: "PlaceHolder Text",
    vendor: {
      name: "Nameless Vendor",
      icon: "👵",
    },
    price: 0,
    rating: 0.0,
    soldCount: 0,
    image: "",
    href: "/products/crochet-keychain",
  },
  {
    id: "PlaceHolder Text3",
    name: "PlaceHolder Text",
    vendor: {
      name: "Nameless Vendor",
      icon: "👵",
    },
    price: 0,
    rating: 0.0,
    soldCount: 0,
    image: "👵",
    href: "/products/acrylic-keychains",
  },
  {
    id: "PlaceHolder Text4",
    name: "PlaceHolder Text",
    vendor: {
      name: "Nameless Vendor",
      icon: "👵",
    },
    price: 0,
    rating: 0.0,
    soldCount: 0,
    image: "",
    href: "",
  },
  {
    id: "PlaceHolder Text5",
    name: "PlaceHolder Text",
    vendor: {
      name: "Nameless Vendor",
      icon: "👵",
    },
    price: 0,
    rating: 0.0,
    soldCount: 0,
    image: "",
    href: "",
  },
];

export function BestSellersSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-green-50/50 via-yellow-50/30 to-orange-50/50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Best Sellers
            </h2>
            <p className="text-sm text-slate-600">
              Top-rated products from trusted local vendors
            </p>
          </div>

          <Link
            href="/customer/best-sellers"
            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            View All
            <ArrowRight className="size-4" />
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {BEST_SELLER_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100"
            >
              {/* Favorite Button */}
              <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors duration-200">
                <Heart className="size-4 text-slate-400 hover:text-red-500" />
              </button>

              {/* Product Image */}
              {/* <Link href={product.href} className="block">
                <div className="aspect-square bg-slate-100 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link> */}

              {/* Product Details */}
              <div className="p-4 space-y-3">
                {/* Vendor Info */}
                <div className="flex items-center gap-2">
                  <span className="text-xs">{product.vendor.icon}</span>
                  <p className="text-xs text-slate-500 truncate flex-1">
                    {product.vendor.name}
                  </p>
                </div>

                {/* Product Name */}
                <Link href={product.href}>
                  <h3 className="font-semibold text-slate-800 hover:text-emerald-600 transition-colors duration-200 line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating and Sales */}
                <div className="flex items-center gap-1">
                  <Star className="size-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-slate-700">
                    {product.rating}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">
                    {product.soldCount.toLocaleString()} sold
                  </span>
                </div>

                {/* Price */}
                <p className="text-lg font-bold text-slate-800">
                  ₱{product.price}
                </p>

                {/* Add to Cart Button */}
                <button className="w-full cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}