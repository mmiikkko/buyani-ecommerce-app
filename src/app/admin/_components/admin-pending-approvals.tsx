"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

type PendingShop = {
  id: string;
  shop_name: string;
  owner_name: string;
  owner_email?: string;
  image?: string;
  description?: string;
  created_at: Date | string;
};

export function PendingApprovals(){
    const [pendingShops, setPendingShops] = useState<PendingShop[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPendingShops = async () => {
            try {
                const res = await fetch("/api/admin/pending-shops");
                const data = await res.json();
                setPendingShops(data || []);
            } catch (error) {
                console.error("Error fetching pending shops:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingShops();
    }, []);

    const handleApprove = async (shopId: string) => {
        try {
            const res = await fetch(`/api/shops?id=${shopId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "approved" }),
            });
            if (res.ok) {
                setPendingShops((prev) => prev.filter((s) => s.id !== shopId));
            }
        } catch (error) {
            console.error("Error approving shop:", error);
        }
    };

    const handleReject = async (shopId: string) => {
        try {
            const res = await fetch(`/api/shops?id=${shopId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setPendingShops((prev) => prev.filter((s) => s.id !== shopId));
            }
        } catch (error) {
            console.error("Error rejecting shop:", error);
        }
    };

    return(
        <div className="min-w-[45%] max-w-[200%] min-h-[100%] flex flex-wrap gap-4 items-center justify-center">
            <Card className="min-w-[100%] max-w-[250%] min-h-[100%] flex flex-col justify-start pt-5 pb-5">
                <CardHeader>
                    <div className="flex flex-row justify-between">
                        <h1 className="font-bold">Pending Seller Approvals</h1>
                        <Link
                            href="/admin/shops"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:underline"
                            >
                            View All
                        </Link>
                    </div>
                    
                    <CardDescription>
                        {pendingShops.length} shop{pendingShops.length !== 1 ? "s" : ""} awaiting approval
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    {loading ? (
                        <p className="text-sm text-gray-500">Loading...</p>
                    ) : pendingShops.length === 0 ? (
                        <p className="text-sm text-gray-500">No pending approvals</p>
                    ) : (
                        pendingShops.slice(0, 5).map((shop) => (
                            <div key={shop.id} className="flex items-center gap-3 p-3 border rounded-lg">
                                {shop.image && (
                                    <Image
                                        src={shop.image}
                                        alt={shop.shop_name}
                                        width={50}
                                        height={50}
                                        className="rounded object-cover"
                                    />
                                )}
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{shop.shop_name}</p>
                                    <p className="text-xs text-gray-500">{shop.owner_name}</p>
                                    {shop.owner_email && (
                                        <p className="text-xs text-gray-400">{shop.owner_email}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                        onClick={() => handleApprove(shop.id)}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="text-xs"
                                        onClick={() => handleReject(shop.id)}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
            
        </div>
        
    )
}