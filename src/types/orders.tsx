export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  subtotal: number;
};

export type Order = {
  orderId: string;          // orders.id
  buyerId: string;
  addressId?: string | null;
  total: number;
  createdAt: string;

  shopName: string;         // comes from JOIN shop.shopName
  items: OrderItem[];
};
