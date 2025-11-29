"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
// import Cart from "@/assets/seller-imgs/cart-symbol.png";
// import People from "@/assets/admin/people.png";
// import Shop from "@/assets/admin/shop.png";

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
    <div className="min-w-[100%] max-w-[150%] flex flex-row gap-5 items-center justify-center mb-5">
      {/* Cash / Sales */}
      <div className="min-w-[22%] max-w-[30%]">
        <Card className="w-full min-w-[300px] max-w-[530px] min-h-[180px] flex flex-col justify-between">
          <CardHeader>
            <Image src={Cash} alt="Cash" width={55} height={55} />
          </CardHeader>
          <CardContent className="flex flex-col">
            <h5>Total Revenue</h5>
            <h5>{totalRevenue ?? ""}</h5>
          </CardContent>
        </Card>
      </div>

      {/* Total Orders */}
      <div className="min-w-[22%] max-w-[30%]">
        <Card className="w-full min-w-[300px] max-w-[530px] min-h-[180px] flex flex-col justify-between">
          <CardHeader>
            <Image src={Cart} alt="Cart" width={55} height={55} />
          </CardHeader>
          <CardContent className="flex flex-col">
            <h5>Total Orders</h5>
            <h5>{totalOrders ?? ""}</h5>
          </CardContent>
        </Card>
      </div>

      {/* Pending Orders */}
      <div className="min-w-[22%] max-w-[30%]">
        <Card className="w-full min-w-[300px] max-w-[530px] min-h-[180px] flex flex-col justify-between">
          <CardHeader>
            <Image src={People} alt="People" width={55} height={55} />
          </CardHeader>
          <CardContent className="flex flex-col">
            <h5>Active Users</h5>
            <h5>{activeUsers ?? ""}</h5>
          </CardContent>
        </Card>
      </div>

      {/* Total Products */}
      <div className="min-w-[22%] max-w-[30%]">
        <Card className="w-full min-w-[300px] max-w-[530px] min-h-[180px] flex flex-col justify-between">
          <CardHeader>
            <Image src={Shop} alt="Shop" width={55} height={55} />
          </CardHeader>
          <CardContent className="flex flex-col">
            <h5>Active Sellers</h5>
            <h5>{activeSellers ?? ""}</h5>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
