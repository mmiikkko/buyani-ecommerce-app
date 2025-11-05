import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FeaturedCategory {
  id: string;
  name: string;
  tag: string;
  itemCount: number;
  href: string;
  gradient: string;
  nameClassName: string;
  itemCountClassName: string;
  image: string | null;
}

const FEATURED_CATEGORIES: FeaturedCategory[] = [
  {
    id: "local-snacks",
    name: "Local Snacks",
    tag: "Food & Snacks",
    itemCount: 0,
    href: "/customer/view-all-categories?category=local-snacks",
    gradient: "from-orange-200/70 via-orange-100 to-orange-50",
    nameClassName: "text-amber-900",
    itemCountClassName: "bg-orange-400",
    image: "",
  },
  {
    id: "handmade",
    name: "Handmade",
    tag: "Arts & Crafts",
    itemCount: 0,
    href: "/customer/view-all-categories?category=handmade",
    gradient: "from-green-200/60 via-green-100 to-emerald-50",
    nameClassName: "text-green-800",
    itemCountClassName: "bg-green-400",
    image: "",
  },
  {
    id: "vegetables",
    name: "Vegetables",
    tag: "Fresh & Organic",
    itemCount: 0,
    href: "/customer/view-all-categories?category=vegetables",
    gradient: "from-orange-200/70 via-orange-100 to-orange-50",
    nameClassName: "text-amber-900",
    itemCountClassName: "bg-orange-400",
    image: "",
  },
  {
    id: "essentials",
    name: "Essentials",
    tag: "Accessories",
    itemCount: 0,
    href: "/customer/view-all-categories?category=essentials",
    gradient: "from-green-200/60 via-green-100 to-emerald-50",
    nameClassName: "text-green-800",
    itemCountClassName: "bg-green-400",
    image: "",
  },
  {
    id: "novelty-items",
    name: "Novelty Items",
    tag: "Collection",
    itemCount: 0,
    href: "/customer/view-all-categories?category=novelty",
    gradient: "from-orange-200/70 via-orange-100 to-orange-50",
    nameClassName: "text-amber-900",
    itemCountClassName: "bg-orange-400",
    image: "",
  },
  {
    id: "souvenir",
    name: "Souvenir",
    tag: "Collection",
    itemCount: 0,
    href: "/customer/view-all-categories?category=souvenir",
    gradient: "from-green-200/60 via-green-100 to-emerald-50",
    nameClassName: "text-green-800",
    itemCountClassName: "bg-green-400",
    image: "",
  },
];

export function ShopByCategorySection() {
  return (
    <section className="py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">
              Shop by Category
            </p>
            <h2 className="text-xl font-semibold text-slate-800 sm:text-2xl">
              Discover local products from CNSC vendors
            </h2>
          </div>

          <Link
            href="/customer/view-all-categories"
            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            View All
            <ArrowRight className="size-4" />
          </Link>
        </header>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {FEATURED_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80 focus-visible:ring-offset-2"
            >
              <div
                className={`flex h-full flex-col justify-between gap-4 rounded-2xl bg-gradient-to-b p-4 shadow-sm transition-shadow duration-200 group-hover:shadow-md ${category.gradient}`}
              >
                <div>
                  <p className="text-xs font-medium uppercase text-slate-600">
                    {category.tag}
                  </p>
                  <p
                    className={`text-lg font-semibold ${category.nameClassName}`}
                  >
                    {category.name}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`size-2 rounded-full ${category.itemCountClassName}`}
                  />
                  <p className="text-sm font-medium text-slate-700">
                    {category.itemCount} items
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
