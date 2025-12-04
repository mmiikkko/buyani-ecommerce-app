// types/orders.ts
export type OrderItem = {
  productName: string;
  quantity: number;
  subtotal: number;
};

export type Order = {
  orderId: string;
  createdAt: string; // ISO string date
  total: number;
  shopName: string;
  items: OrderItem[];
};
