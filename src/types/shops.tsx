export type Shop = {
    id: string;
    seller_id: string;
    shop_name: string;
    shop_rating: string | null;
    description: string | null;
    created_at: Date;         // <-- keep as Date
    updated_at: Date | null;  // <-- keep as Date
    image?: string | null;
    status: string | "approved" | "pending" | "suspended";
    owner_name?: string;      // from JOIN
    products?: number;        // product count
}
