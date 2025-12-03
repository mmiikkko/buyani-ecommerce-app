import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Shop } from "@/types/shops";

export function AdminShops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/shops")
      .then((res) => res.json())
      .then(setShops)
      .finally(() => setLoading(false));
  }, []);

  // Example splitting logic (adjust field names as per your schema!):
  const approvedShops = shops.filter((s) => s.status === "approved");
  const pendingShops = shops.filter((s) => s.status === "pending");

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-10">
      {/* APPROVED SHOPS */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          Approved Shops ({approvedShops.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedShops.map((shop) => (
            <Card key={shop.id} className="rounded-xl overflow-hidden shadow-sm border">
              {/* IMAGE */}
              <div className="h-32 w-full overflow-hidden">
                <Image
                  src={shop.image || "/assets/placeholder.png"}
                  alt={shop.shop_name}
                  width={400}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                {/* NAME */}
                <p className="text-md font-semibold">{shop.shop_name}</p>
                {/* OWNER */}
                <p className="text-sm text-gray-500 mt-1">
                  Shop owner: {shop.owner_name || shop.seller_id}
                </p>
                {/* STATUS */}
                <span className="text-green-600 font-medium text-sm mt-3 inline-block">
                  Approved
                </span>
                {/* ACTION BUTTONS */}
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" className="text-gray-600 border-gray-300 cursor-pointer">
                    View Details
                  </Button>
                  <Button
                    variant="destructive"
                    className="text-white cursor-pointer"
                    // onClick={() => suspendShop(shop.id)}
                  >
                    Suspend
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* PENDING SHOPS */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          Pending Approval ({pendingShops.length})
        </h2>
        {pendingShops.length === 0 && (
          <p className="text-gray-500 text-sm mt-2">No pending shops.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingShops.map((shop) => (
            <Card key={shop.id} className="rounded-xl overflow-hidden shadow-sm border">
              {/* IMAGE */}
              <div className="h-32 w-full overflow-hidden">
                <Image
                  src={shop.image || "/assets/placeholder.png"}
                  alt={shop.shop_name}
                  width={400}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                {/* NAME */}
                <p className="text-md font-semibold">{shop.shop_name}</p>
                {/* OWNER */}
                <p className="text-sm text-gray-500 mt-1">
                  Shop owner: {shop.owner_name || shop.shop_name}
                </p>
                {/* STATUS */}
                <span className="text-yellow-600 font-medium text-sm mt-3 inline-block">
                  Pending
                </span>
                {/* ACTION BUTTONS */}
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    className="text-gray-600 border-gray-300 cursor-pointer"
                    // onClick={() => approveShop(shop.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="text-white cursor-pointer"
                    // onClick={() => deleteShop(shop.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}