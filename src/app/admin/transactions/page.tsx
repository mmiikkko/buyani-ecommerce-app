"use client";
import { AdminTransactions } from "../_components/admin-transactions";

export default function Transactions() {
    return(
        <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-18 mx-3">
            <h1 className="text-xl font-bold mb-1 text-[#2E7D32]">
            Transactions
            </h1>
            <p>Track all system transactions </p>
            
            <div className="mx-8">
              <AdminTransactions />
            </div>

        </section>

    );
    
}