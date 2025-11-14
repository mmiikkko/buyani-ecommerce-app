"use-client"

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

export function CardActivity(){

    return(
        <div className="min-w-[100%] max-w-[150%] flex flex-row gap-5 items-center justify-center mb-5">
            <div className="min-w-[22%] max-w-[30%]">
            {/* Cash */}
            <Card className="w-full min-w-[300px] max-w-[530px] min-h-[180px] flex flex-col justify-between">
            <CardHeader>
                <div className="flex flex-row">
                <Image
                    src={Cash}
                    alt="Cash"
                    width={55}
                    height={55}
                />
                </div>

            </CardHeader>
            <CardContent className="flex flex-col">
                <h5>Total Sales</h5>
                <h5>Hardcoded</h5>
            </CardContent>
            </Card>
            </div>

            <div className="min-w-[22%] max-w-[30%]">
            {/* Orders */}
            <Card className="w-full min-w-[300px] max-w-[530px] min-h-[180px] flex flex-col justify-between">
            <CardHeader>
            <div className="flex flex-row">
            <Image
                    src={Cart}
                    alt="Cart"
                    width={55}
                    height={55}
                />
            </div>

            </CardHeader>
            <CardContent className="flex flex-col">
                <h5>Total Orders</h5>
                <h5>Hardcoded</h5>
            </CardContent>
            </Card>
            </div>

            <div className="min-w-[22%] max-w-[30%]">
            {/* Pending */}
            <Card className="w-full min-w-[300px] max-w-[530px] min-h-[180px] flex flex-col justify-between">
            <CardHeader>
            <div className="flex flex-row">
            <Image
                    src={Clock}
                    alt="Clock"
                    width={55}
                    height={55}
                />
            </div>

                
            </CardHeader>
            <CardContent className="flex flex-col ">
                <h5>Pending Orders</h5>
                <h5>Hardcoded</h5>
            </CardContent>
            </Card>
            </div>

            <div className="min-w-[22%] max-w-[30%]">
            {/* Products */}
            <Card className="w-full min-w-[300px] max-w-[530px] min-h-[180px] flex flex-col justify-between">
            <CardHeader>
            <div className="flex flex-row">
            <Image
                    src={Package}
                    alt="Package"
                    width={55}
                    height={55}
                />
            </div>

                
            </CardHeader>
            <CardContent className="flex flex-col">
                <h5>Total Products</h5>
                <h5>Hardcoded</h5>
            </CardContent>
            </Card>
            </div>
            
        </div>
        
    )
}