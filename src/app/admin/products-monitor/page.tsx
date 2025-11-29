"use client";
import { AdminProducts } from "../_components/admin-products";


export default function ProductsMonitor() {
    return (
        <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-18 mx-3">
            <h1 className="text-xl font-bold mb-1 text-[#2E7D32]">
            Products Management
            </h1>
            <p>Monitor every products listed by sellers</p>

            <AdminProducts />
        </section>

    );

}