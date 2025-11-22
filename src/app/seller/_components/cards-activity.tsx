"use client";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import Cart from "@/assets/seller-imgs/cart-symbol.png";
import Cash from "@/assets/seller-imgs/cash-symbol.png";
import Clock from "@/assets/seller-imgs/clocksymbol.png";
import Package from "@/assets/seller-imgs/package-symbol.png";

interface CardActivityProps {
  totalSales?: number | string;
  totalOrders?: number | string;
  pendingOrders?: number | string;
  totalProducts?: number | string;
}

export function CardActivity({
  totalSales,
  totalOrders,
  pendingOrders,
  totalProducts,
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
            <h5>Total Sales</h5>
            <h5>{totalSales ?? ""}</h5>
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
            <Image src={Clock} alt="Clock" width={55} height={55} />
          </CardHeader>
          <CardContent className="flex flex-col">
            <h5>Pending Orders</h5>
            <h5>{pendingOrders ?? ""}</h5>
          </CardContent>
        </Card>
      </div>

      {/* Total Products */}
      <div className="min-w-[22%] max-w-[30%]">
        <Card className="w-full min-w-[300px] max-w-[530px] min-h-[180px] flex flex-col justify-between">
          <CardHeader>
            <Image src={Package} alt="Package" width={55} height={55} />
          </CardHeader>
          <CardContent className="flex flex-col">
            <h5>Total Products</h5>
            <h5>{totalProducts ?? ""}</h5>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
