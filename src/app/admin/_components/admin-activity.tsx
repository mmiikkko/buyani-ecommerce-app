"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Cart from "@/assets/seller-imgs/cart-symbol.png";
import Cash from "@/assets/seller-imgs/cash-symbol.png";
import People from "@/assets/admin/people.png";
import Shop from "@/assets/admin/shop.png";

interface CardActivityProps {
  totalRevenue?: number | string;
  totalOrders?: number | string;
  activeUsers?: number | string;
  activeSellers?: number | string;
}

export function CardActivity({
  totalRevenue,
  totalOrders,
  activeUsers,
  activeSellers,
}: CardActivityProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Revenue */}
      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-emerald-600 rounded-lg">
              <Image src={Cash} alt="Cash" width={40} height={40} className="brightness-0 invert" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-gray-600 mb-1 font-medium">Total Revenue</p>
          <p className="text-xl font-bold text-gray-800">{totalRevenue ?? "₱0.00"}</p>
        </CardContent>
      </Card>

      {/* Total Orders */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Image src={Cart} alt="Cart" width={40} height={40} className="brightness-0 invert" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-gray-600 mb-1 font-medium">Total Orders</p>
          <p className="text-xl font-bold text-gray-800">{totalOrders ?? "0"}</p>
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Image src={People} alt="People" width={40} height={40} className="brightness-0 invert" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-gray-600 mb-1 font-medium">Active Users</p>
          <p className="text-xl font-bold text-gray-800">{activeUsers ?? "0"}</p>
        </CardContent>
      </Card>

      {/* Active Sellers */}
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-amber-600 rounded-lg">
              <Image src={Shop} alt="Shop" width={40} height={40} className="brightness-0 invert" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-gray-600 mb-1 font-medium">Active Sellers</p>
          <p className="text-xl font-bold text-gray-800">{activeSellers ?? "0"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
