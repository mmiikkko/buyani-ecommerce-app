"use client";
import { useEffect, useState } from "react";
import { AdminShops } from "../_components/admin-shops";

export default function Shops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  

  return (
    <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-18 mx-3">
      <h1 className="text-xl font-bold mb-1 text-[#2E7D32]">
        Shops Monitoring
      </h1>
      <p> Shop management. </p>
      <AdminShops />
    </section>
  );
}
