import type { ProductImage } from "./products"
import type { Transaction, Payment } from "./transactions";

export type Order = {
    id: string;
    buyerId: string;
    addressId: string;
    total: number | null;
    createdAt: Date;
    updatedAt: Date;

    // JOIN: order_items + product + product_images
    items: OrderItem[];

    // JOIN: payments
    payment?: Payment | null;

    // JOIN: transactions
    transactions: Transaction[];

    // UI-only fields (optional)
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
    type: string;
}

export type OrderItem = {
    id: string;
    orderId: string;
    productId: string;
  
    quantity: number;
    subtotal: number;
  
    product: {
      id: string;
      productName: string;
      price?: number;
      images: ProductImage[]; // from your productImages table
    };
  };
  
