import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export type Shop = {
    id: string;
    seller_id: string;
    shop_name: string;
    shop_rating: string | null;
    description: string | null;
    created_at: Timestamp;
    updated_at: Timestamp | null;
    image?: string | null;
    status: "approved" | "pending" | "suspended";
    owner_name?: string; // from JOIN
}


