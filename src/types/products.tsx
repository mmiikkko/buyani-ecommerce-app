export type Product = {
    id: string;
    shopId: string;
    categoryId: string;
  
    productName: string;
    SKU?: string | null;
    description?: string | null;
  
    price: number;
    rating?: string | null;
    isAvailable: boolean;
    status: string;
  
    // Inventory table
    stock: number; // quantityInStock
    itemsSold?: number | null;
  
    images: ProductImage[] 
    createdAt: Date;
    updatedAt: Date;
  };


export type ProductImage = {
    id: string
    product_id: string
    image_url: string
    is_primary: boolean
 } 

export type Variant = {
    id: string;
    sku: string;
    optionCombo: string[]; // like ["Large", "Red"]
    price: number;
    stock: number;
  };