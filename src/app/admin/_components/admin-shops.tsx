import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { USER_ROLES } from "@/server/schema/auth-schema";
import type { Shop } from "@/types/shops";
import {
  Bell,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Store,
  Trash2,
  User,
  XCircle
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminShopModal } from "./admin-shops-modal";

export function AdminShops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const res = await fetch("/api/shops?status=all");

      if (!res.ok) {
        const fallbackRes = await fetch("/api/shops");
        const fallbackData = await fallbackRes.json();
        const normalized = Array.isArray(fallbackData)
          ? fallbackData
          : Array.isArray((fallbackData as any)?.shops)
            ? (fallbackData as any).shops
            : [];
        setShops(normalized);
      } else {
        const data = await res.json();
        const normalized = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.shops)
            ? (data as any).shops
            : [];
        setShops(normalized);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);

      fetch("/api/shops")
        .then((res) => res.json())
        .then((d) => {
          const normalized = Array.isArray(d)
            ? d
            : Array.isArray((d as any)?.shops)
              ? (d as any).shops
              : [];
          setShops(normalized);
        })
        .catch(console.error);
    } finally {
      setLoading(false);
    }
  };

  const approvedShops = shops.filter((s) => s.status?.toLowerCase() === "approved");
  const pendingShops = shops.filter((s) => s.status?.toLowerCase() === "pending");
  const suspendedShops = shops.filter((s) => s.status?.toLowerCase() === "suspended");

  const handleSendRentNotification = async (shop: Shop) => {
    try {
      const res = await fetch("/api/seller-notifications", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: shop.seller_id,
          title: "Monthly Rent Payment Reminder",
          message: `Your monthly rent payment for "${shop.shop_name}" is due soon. Please ensure timely payment to avoid any service interruption.`,
          type: "payment_reminder",
        }),
      });

      if (!res.ok) throw new Error("Failed to send notification");

      toast.success(`Rent reminder sent to "${shop.shop_name}"`);
    } catch (error) {
      console.error("Send notification error:", error);
      toast.error("Failed to send notification");
    }
  };

  if (loading) {
    return (
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="rounded-xl overflow-hidden">
              <Skeleton className="h-32 w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* APPROVED SHOPS */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Approved Shops
            </h2>
            <p className="text-sm text-gray-500">
              {approvedShops.length} {approvedShops.length === 1 ? "shop" : "shops"} active
            </p>
          </div>
        </div>

        {approvedShops.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No approved shops yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedShops.map((shop) => (
              <Card
                key={shop.id}
                className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30"
              >
                <div className="h-40 w-full overflow-hidden relative">
                  <Image
                    src={shop.image || "/assets/placeholder.png"}
                    alt={shop.shop_name}
                    width={400}
                    height={160}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-emerald-600 text-white border-0 shadow-md">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Approved
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                    {shop.shop_name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <User className="h-4 w-4" />
                    <span className="truncate">{shop.owner_name || shop.seller_id}</span>
                  </div>

                  {shop.products !== undefined && (
                    <p className="text-xs text-gray-500 mb-4">
                      {shop.products} {shop.products === 1 ? "product" : "products"}
                    </p>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      className="flex-1 cursor-pointer border-gray-300 hover:bg-gray-50"
                      onClick={() => {
                        setSelectedShop(shop);
                        setModalOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>

                    <Button
                      variant="outline"
                      className="flex-1 text-amber-700 cursor-pointer shadow-sm"
                      onClick={() => handleSendRentNotification(shop)}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Send Notification
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* PENDING SHOPS */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Pending Approval
            </h2>
            <p className="text-sm text-gray-500">
              {pendingShops.length} {pendingShops.length === 1 ? "shop" : "shops"} awaiting review
            </p>
          </div>
        </div>

        {pendingShops.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No pending shops.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingShops.map((shop) => (
              <Card
                key={shop.id}
                className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-amber-100 bg-gradient-to-br from-white to-amber-50/30"
              >
                <div className="h-40 w-full overflow-hidden relative">
                  <Image
                    src={shop.image || "/assets/placeholder.png"}
                    alt={shop.shop_name}
                    width={400}
                    height={160}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-amber-600 text-white border-0 shadow-md">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                    {shop.shop_name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <User className="h-4 w-4" />
                    <span className="truncate">{shop.owner_name || shop.seller_id}</span>
                  </div>

                  {shop.products !== undefined && (
                    <p className="text-xs text-gray-500 mb-4">
                      {shop.products} {shop.products === 1 ? "product" : "products"}
                    </p>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      className="flex-1 cursor-pointer bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700"
                      onClick={() => {
                        toast.promise(
                          async () => {
                            const res = await fetch(`/api/shops?id=${shop.id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ status: "approved" }),
                            });

                            if (!res.ok) throw new Error("Failed to approve");

                            await fetchShops();
                            return `"${shop.shop_name}" approved`;
                          },
                          {
                            loading: "Approving shop...",
                            success: (msg) => msg,
                            error: "Failed to approve shop",
                          }
                        );
                      }}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>

                    <Button
                      variant="destructive"
                      className="flex-1 text-white cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      onClick={() => {
                        toast.promise(
                          async () => {
                            const res = await fetch(`/api/shops?id=${shop.id}`, {
                              method: "DELETE",
                            });

                            if (!res.ok) throw new Error("Failed to reject");

                            await fetchShops();
                            return `"${shop.shop_name}" rejected`;
                          },
                          {
                            loading: "Rejecting shop...",
                            success: (msg) => msg,
                            error: "Failed to reject shop",
                          }
                        );
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedShop && (
        <AdminShopModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedShop(null);
          }}
          shop={{
            ...selectedShop,
            description: selectedShop.description ?? undefined,
            image: selectedShop.image ?? undefined,
          }}
        />
      )}
    </div>
  );
}