export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  subtotal: number;
};

export type Order = {
  orderId: string;          // orders.id
  id?: string;              // alternative id field
  buyerId: string;
  buyerName?: string;       // buyer's name from user table
  addressId?: string | null;
  total: number | null;
  createdAt: string;
  updatedAt?: string;

  shopName?: string;         // comes from JOIN shop.shopName
  items: OrderItem[];
  status?: string;          // order status
  payment?: any;            // payment information
  transactions?: any[];     // transaction information
};
