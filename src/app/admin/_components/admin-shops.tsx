"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminShops() {
  const approvedShops = [
    {
      id: 1,
      name: "Daet Pineapple Farm",
      owner: "John Doe",
      image: "/pineapple.jpg",
      status: "approved",
    },
    {
      id: 2,
      name: "Crafts",
      owner: "John Doe",
      image: "/crafts.jpg",
      status: "approved",
    },
    {
      id: 3,
      name: "Snacks",
      owner: "Azied Delen",
      image: "/snacks.jpg",
      status: "approved",
    },
  ];

  const pendingShops: unknown[] = [];

  return (
    <div className="p-6 w-full min-h-screen bg-green-50 rounded-xl">
      {/* SEARCH BAR */}
      <Input
        placeholder="Search shops by name or SKU"
        className="w-full mb-6 bg-white"
      />

      {/* APPROVED SHOPS */}
      <h2 className="text-lg font-semibold mb-2">
        Approved Shops ({approvedShops.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {approvedShops.map((shop) => (
          <Card key={shop.id} className="rounded-xl overflow-hidden shadow-sm border">
            {/* IMAGE */}
            <div className="h-32 w-full overflow-hidden">
              <img
                src={shop.image}
                alt={shop.name}
                className="h-full w-full object-cover"
              />
            </div>

            <CardContent className="p-4">
              {/* NAME */}
              <p className="text-md font-semibold">{shop.name}</p>

              {/* OWNER */}
              <p className="text-sm text-gray-500 mt-1">
                Store owner: {shop.owner}
              </p>

              {/* STATUS */}
              <span className="text-green-600 font-medium text-sm mt-3 inline-block">
                Approved
              </span>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  className="text-gray-600 border-gray-300"
                >
                  View Details
                </Button>

                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                >
                  Suspend
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PENDING SHOPS */}
      <h2 className="text-lg font-semibold mb-2">
        Pending Approval ({pendingShops.length})
      </h2>

      {pendingShops.length === 0 && (
        <p className="text-gray-500 text-sm mt-2">No pending shops.</p>
      )}
    </div>
  );
}
