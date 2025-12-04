export type Product = {
    id: string;
    shopId: string;
    categoryId: string;
  
    productName: string;
    SKU: string;
    description?: string | null;
  
    price?: number;
    rating?: string | null;
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
    shopStatus?: string | null;
    categoryName?: string | null;
    reviewCount?: number;
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
