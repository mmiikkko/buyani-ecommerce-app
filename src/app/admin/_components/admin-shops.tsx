import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { USER_ROLES } from "@/server/schema/auth-schema";
import type { Shop } from "@/types/shops";
import {
  Ban,
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

  // NEW: Modal state
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
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

    fetchShops();
  }, []);

  const approvedShops = shops.filter((s) => s.status === "approved");
  const pendingShops = shops.filter((s) => s.status === "pending");
  const suspendedShops = shops.filter((s) => s.status === "suspended");

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
                      variant="destructive"
                      className="flex-1 text-white cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      onClick={async () => {
                        try {
                          const res = await fetch(`/api/shops?id=${shop.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status: "suspended" }),
                          });

                          if (res.ok) {
                            await fetch(`/api/users?id=${shop.seller_id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ role: USER_ROLES.SUSPENDED }),
                            });

                            const refreshRes = await fetch("/api/shops?status=all");
                            const refreshData = await refreshRes.json();
                            const normalized = Array.isArray(refreshData)
                              ? refreshData
                              : Array.isArray((refreshData as any)?.shops)
                              ? (refreshData as any).shops
                              : [];
                            setShops(normalized);
                            toast.success(`"${shop.shop_name}" is suspended`);
                          } else {
                            toast.error(`Failed to suspend "${shop.shop_name}"`);
                          }
                        } catch (error) {
                          console.error("Error suspending shop:", error);
                          toast.error(`Error suspending "${shop.shop_name}"`);
                        }
                      }}
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Suspend
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
                      onClick={async () => {
                        try {
                          const res = await fetch(`/api/shops?id=${shop.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status: "approved" }),
                          });

                          if (res.ok) {
                            const refreshRes = await fetch("/api/shops?status=all");
                            const refreshData = await refreshRes.json();
                            const normalized = Array.isArray(refreshData)
                              ? refreshData
                              : Array.isArray((refreshData as any)?.shops)
                              ? (refreshData as any).shops
                              : [];
                            setShops(normalized);
                            toast.success(`"${shop.shop_name}" is approved`);
                          } else {
                            toast.error(`Failed to approve "${shop.shop_name}"`);
                          }
                        } catch (error) {
                          console.error("Error approving shop:", error);
                          toast.error(`Error approving "${shop.shop_name}"`);
                        }
                      }}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>

                    <Button
                      variant="destructive"
                      className="flex-1 text-white cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      onClick={async () => {
                        try {
                          const res = await fetch(`/api/shops?id=${shop.id}`, {
                            method: "DELETE",
                          });

                          if (res.ok) {
                            const refreshRes = await fetch("/api/shops?status=all");
                            const refreshData = await refreshRes.json();
                            const normalized = Array.isArray(refreshData)
                              ? refreshData
                              : Array.isArray((refreshData as any)?.shops)
                              ? (refreshData as any).shops
                              : [];
                            setShops(normalized);
                            toast.success(`"${shop.shop_name}" is deleted`);
                          } else {
                            toast.error(`Failed to delete "${shop.shop_name}"`);
                          }
                        } catch (error) {
                          console.error("Error deleting shop:", error);
                          toast.error(`Error deleting "${shop.shop_name}"`);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* SUSPENDED SHOPS */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Suspended Shops
            </h2>
            <p className="text-sm text-gray-500">
              {suspendedShops.length} {suspendedShops.length === 1 ? "shop" : "shops"} suspended
            </p>
          </div>
        </div>

        {suspendedShops.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed">
            <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No suspended shops.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suspendedShops.map((shop) => (
              <Card 
                key={shop.id} 
                className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-red-100 bg-gradient-to-br from-white to-red-50/30"
              >
                <div className="h-40 w-full overflow-hidden relative">
                  <Image
                    src={shop.image || "/assets/placeholder.png"}
                    alt={shop.shop_name}
                    width={400}
                    height={160}
                    className="h-full w-full object-cover opacity-75 grayscale"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-red-600 text-white border-0 shadow-md">
                      <XCircle className="h-3 w-3 mr-1" />
                      Suspended
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
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      onClick={async () => {
                        try {
                          const res = await fetch(`/api/shops?id=${shop.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status: "approved" }),
                          });

                          if (res.ok) {
                            // Restore seller role
                            await fetch(`/api/users?id=${shop.seller_id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ role: USER_ROLES.SELLER }),
                            });

                            const refreshRes = await fetch("/api/shops?status=all");
                            const refreshData = await refreshRes.json();
                            const normalized = Array.isArray(refreshData)
                              ? refreshData
                              : Array.isArray((refreshData as any)?.shops)
                              ? (refreshData as any).shops
                              : [];
                            setShops(normalized);
                            toast.success(`"${shop.shop_name}" is unsuspended`);
                          } else {
                            toast.error(`Failed to unsuspend "${shop.shop_name}"`);
                          }
                        } catch (error) {
                          console.error("Error unsuspending shop:", error);
                          toast.error(`Error unsuspending "${shop.shop_name}"`);
                        }
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Unsuspend
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
