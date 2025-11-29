"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import  Image from "next/image";
import { AdminSearchbar } from "../_components/admin-users-searchbar";
import { useState } from "react";

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

    const [filter, setFilter] = useState<string>("all");
    const [search, setSearch] = useState<string>("");

  return (
    <div className="px-5 w-full min-h-screen bg-green-50 rounded-xl">
      {/* SEARCH BAR */}
      <AdminSearchbar
      placeholder="Search by shop name or owner"
      filterOptions={[
        { value: "all", label: "All Shops" },
        { value: "approved", label: "Approved" },
        { value: "unverified", label: "Unverified" },
        { value: "suspended", label: "Suspended" },
      ]}
      onFilterChange={(val) => setFilter(val)}
      onSearchChange={(val) => setSearch(val)}
    />


      {/* APPROVED SHOPS */}
      <h2 className="text-lg font-semibold my-2">
        Shops ({approvedShops.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {approvedShops.map((shop) => (
          <Card key={shop.id} className="rounded-xl overflow-hidden shadow-sm border">
            {/* IMAGE */}
            <div className="h-32 w-full overflow-hidden">
              <Image
                src={shop.image}
                alt={shop.name}
                width={400}
                height={128}
                className="h-full w-full object-cover"
              />
            </div>

            <CardContent className="p-4">
              {/* NAME */}
              <p className="text-md font-semibold">{shop.name}</p>

              {/* OWNER */}
              <p className="text-sm text-gray-500 mt-1">
                Shop owner: {shop.owner}
              </p>

              {/* STATUS */}
              <span className="text-green-600 font-medium text-sm mt-3 inline-block">
                Approved
              </span>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  className="text-gray-600 border-gray-300 cursor-pointer"
                >
                  View Details
                </Button>

                <Button
                  variant="destructive"
                  className="text-white cursor-pointer"
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
