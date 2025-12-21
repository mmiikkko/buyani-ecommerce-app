export type Product = {
  id: string;
  shopId: string;
  categoryId: string;

  productName: string;
  SKU: string;
  description?: string | null;

  price?: number;
  rating?: number | string | null;
  isAvailable: boolean;
  status: string;

  // Inventory table
  stock: number; // quantityInStock
  itemsSold?: number | null;

  images: ProductImage[]
  createdAt: Date;
  updatedAt: Date;
  shipping?: ShippingDetails;

  // Additional fields from joins
  shopName?: string | null;
  shopImage?: string | null;
  shopStatus?: string | null;
  categoryName?: string | null;
  reviewCount?: number;
  variations?: (VariationOption | ProductVariation)[];
};

export type VariationOption = {
  name: string; // e.g. "Size"
  values: string[]; // e.g. ["S", "M", "L"]
};

export type ProductVariation = {
  id: string;
  productId: string;
  variationName: string | null;
  variationType: string;
  variationValue: string;
  price: string;
  SKU: string | null;
  quantityInStock?: number;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
};

export type ShippingDetails = {
  weight?: number;
  weightUnit?: string;
  length?: number;
  width?: number;
  height?: number;
  shippingFee?: number;

}

export type ProductImage = {
  id: string
  product_id: string
  image_url: string
  is_primary: boolean
} 
