import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import {
  products,
  productImages,
  productInventory,
  shop,
} from "@/server/schema/auth-schema";
import { eq, inArray } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import { v4 as uuidv4 } from "uuid";

// GET /api/sellers/products - Get products for the current seller
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = session.user.id;

    // Get seller's shop(s)
    const sellerShops = await db
      .select({ id: shop.id })
      .from(shop)
      .where(eq(shop.sellerId, sellerId));

    if (sellerShops.length === 0) {
      return NextResponse.json([]);
    }

    const shopIds = sellerShops.map((s) => s.id);

    // Get products from seller's shops
    const productsList = await db
      .select()
      .from(products)
      .where(inArray(products.shopId, shopIds));

    // Get product images
    const productIds = productsList.map((p) => p.id);
    const images = productIds.length > 0
      ? await db
          .select()
          .from(productImages)
          .where(inArray(productImages.productId, productIds))
      : [];

    // Get product inventory
    const inventory = productIds.length > 0
      ? await db
          .select()
          .from(productInventory)
          .where(inArray(productInventory.productId, productIds))
      : [];

    // Transform data to match frontend Product type
    const transformedProducts = productsList.map((product) => {
      const productImagesList = images.filter((img) => img.productId === product.id);
      const productInventoryData = inventory.find((inv) => inv.productId === product.id);

      // Filter and map images - ensure we preserve the full URL from database
      console.log(`[DEBUG GET] Product ${product.id} (${product.productName}): Found ${productImagesList.length} images in DB`);
      productImagesList.forEach((img, idx) => {
        console.log(`[DEBUG GET] Image ${idx + 1}: id=${img.id}, urlLength=${img.url?.length || 0}, urlType=${typeof img.url}, startsWithData=${img.url?.startsWith("data:image/")}, preview=${img.url?.substring(0, 50) || "null"}...`);
      });
      
      const productImages = productImagesList
        .filter(img => {
          // Only include images with valid, non-empty URLs
          const isValid = img.url && 
                 typeof img.url === "string" && 
                 img.url.trim() !== "" &&
                 img.url !== "null" &&
                 img.url !== "undefined";
          if (!isValid) {
            console.log(`[DEBUG GET] Filtered out image ${img.id} for product ${product.id}: url=${img.url}`);
          }
          return isValid;
        })
        .map((img) => ({
          id: img.id,
          product_id: img.productId,
          // Return as string for seller API (customer API uses array)
          // Preserve the full URL from database (including full data URLs)
          image_url: img.url,
          is_primary: false,
        }));
      
      console.log(`[DEBUG GET] Product ${product.id}: Returning ${productImages.length} images to frontend`);

      return {
        id: product.id,
        shopId: product.shopId,
        categoryId: product.categoryId,
        productName: product.productName,
        SKU: product.SKU || "",
        description: product.description || null,
        price: product.price ? Number(product.price) : undefined,
        rating: product.rating ?? null,
        isAvailable: product.isAvailable,
        status: product.status || "Available",
        stock: productInventoryData?.quantityInStock || 0,
        itemsSold: productInventoryData?.itemsSold || null,
        images: productImages,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error("Error fetching seller products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/sellers/products - Create a new product
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = session.user.id;
    const body = await req.json();

    // Handle database connection errors with retry
    const executeQuery = async <T>(queryFn: () => Promise<T>, retries = 3): Promise<T> => {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          return await queryFn();
        } catch (error: any) {
          const isConnectionError = 
            error?.cause?.code === "ECONNRESET" ||
            error?.cause?.code === "PROTOCOL_CONNECTION_LOST" ||
            error?.cause?.errno === -4077 ||
            error?.message?.includes("ECONNRESET") ||
            error?.message?.includes("Failed query");

          if (isConnectionError && attempt < retries - 1) {
            const delay = Math.min(100 * Math.pow(2, attempt), 1000);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          throw error;
        }
      }
      throw new Error("Query failed after retries");
    };

    // Get seller's shop
    const sellerShop = await executeQuery(async () => {
      return await db
        .select({ id: shop.id })
        .from(shop)
        .where(eq(shop.sellerId, sellerId))
        .limit(1);
    });

    if (sellerShop.length === 0) {
      return NextResponse.json(
        { error: "No shop found for seller" },
        { status: 400 }
      );
    }

    const shopId = sellerShop[0].id;
    const shopStatus = sellerShop[0].status;
    
    // Warn if shop is not approved (products won't show in customer UI)
    if (shopStatus !== "approved") {
      console.warn(`Shop ${shopId} is not approved (status: ${shopStatus}). Products will not be visible to customers.`);
    }

    // Validate required fields
    if (!body.productName) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }
    if (!body.categoryId) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }
    // Price is required in schema, use 0 as default if not provided (for variant-based products)
    if (body.price === undefined || body.price === null) {
      return NextResponse.json({ error: "Price is required" }, { status: 400 });
    }

    // Create product
    const productId = body.id || uuidv4();
    const productStatus = body.status || "Available";
    // Set isAvailable based on status - only "Available" status products are visible to customers
    const isAvailable = productStatus === "Available";
    
    // Generate unique SKU if not provided or if it would be duplicate
    let sku = body.SKU;
    if (!sku) {
      // Generate a unique SKU
      const nameBase = (body.productName || "PRD").replace(/\s+/g, "").toUpperCase().slice(0, 6);
      const timestamp = Date.now().toString(36).slice(-4).toUpperCase();
      const random = Math.random().toString(36).slice(-2).toUpperCase();
      sku = `${nameBase}${timestamp}${random}`;
    }
    
    // Check if SKU already exists and make it unique if needed
    let finalSku = sku;
    let attempts = 0;
    while (attempts < 5) {
      const existingProduct = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.SKU, finalSku))
        .limit(1);
      
      if (existingProduct.length === 0) {
        break; // SKU is unique
      }
      
      // SKU exists, append more random characters
      const randomSuffix = Math.random().toString(36).slice(-3).toUpperCase();
      finalSku = `${sku}${randomSuffix}`;
      attempts++;
    }
    
    const newProduct = {
      id: productId,
      productName: body.productName,
      shopId: shopId,
      categoryId: body.categoryId,
      price: String(body.price),
      SKU: finalSku,
      description: body.description || "",
      rating:
        body.rating === "" ||
        body.rating === undefined ||
        body.rating === null
          ? null
          : Number(body.rating),
      isAvailable: isAvailable,
      status: productStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("Creating product:", {
      productId,
      productName: body.productName,
      status: productStatus,
      isAvailable,
      shopId,
      shopStatus,
      willShowInCustomerUI: isAvailable && shopStatus === "approved",
      imageCount: body.images?.length || 0
    });

    // Try to insert product, handle duplicate SKU error
    try {
      await executeQuery(async () => {
        return await db.insert(products).values(newProduct);
      });
    } catch (insertError: any) {
      // Handle duplicate SKU error specifically
      if (insertError?.cause?.errno === 1062 && insertError?.cause?.sqlMessage?.includes("sku")) {
        console.log(`[DEBUG] Duplicate SKU detected: ${finalSku}, generating new one...`);
        // Generate a completely new unique SKU with UUID part
        const nameBase = (body.productName || "PRD").replace(/\s+/g, "").toUpperCase().slice(0, 6);
        const timestamp = Date.now().toString(36).slice(-4).toUpperCase();
        const random = Math.random().toString(36).slice(-4).toUpperCase();
        const uuidPart = uuidv4().slice(0, 4).replace(/-/g, "").toUpperCase();
        newProduct.SKU = `${nameBase}${timestamp}${random}${uuidPart}`;
        
        console.log(`[DEBUG] New SKU: ${newProduct.SKU}`);
        
        await executeQuery(async () => {
          return await db.insert(products).values(newProduct);
        });
      } else {
        throw insertError;
      }
    }

    // Create inventory if stock is provided
    if (body.stock !== undefined) {
      await executeQuery(async () => {
        return await db.insert(productInventory).values({
          id: uuidv4(),
          productId: productId,
          quantityInStock: body.stock,
          itemsSold: 0,
        });
      });
    }

    // Create images if provided
    // Expecting body.images to be an array of { image_url: string }
    console.log(`[DEBUG API] Received images array: ${body.images ? body.images.length : 0} items`);
    if (body.images && Array.isArray(body.images)) {
      body.images.forEach((img: any, idx: number) => {
        console.log(`[DEBUG API] Image ${idx + 1}:`, {
          hasImageUrl: !!img.image_url,
          imageUrlType: typeof img.image_url,
          imageUrlLength: img.image_url?.length || 0,
          startsWithData: img.image_url?.startsWith("data:image/"),
          preview: img.image_url?.substring(0, 50) || "null"
        });
      });
      
      // Filter and map images - only keep valid URLs
      const imageRows = body.images
        .map((img: { image_url: string }) => {
          const candidate = typeof img.image_url === "string" ? img.image_url : "";
          
          // Only accept valid URLs: http/https, relative paths, or data:image/ URLs
          if (candidate && candidate.trim() !== "") {
            const isValidUrl = 
              candidate.startsWith("http://") ||
              candidate.startsWith("https://") ||
              candidate.startsWith("/") ||
              candidate.startsWith("data:image/");
            
            if (isValidUrl) {
              return {
                id: uuidv4(),
                productId: productId,
                url: candidate.trim(), // Store the full URL (TEXT column can handle long data URLs)
              };
            } else {
              console.log(`[DEBUG API] Rejected image URL: ${candidate.substring(0, 50)}...`);
            }
          } else {
            console.log(`[DEBUG API] Empty or invalid candidate:`, candidate);
          }
          return null; // Mark invalid images as null
        })
        .filter((img): img is { id: string; productId: string; url: string } => img !== null); // Remove null entries
      
      console.log(`[DEBUG API] After filtering: ${imageRows.length} valid images`);

      if (imageRows.length > 0) {
        console.log(`Saving ${imageRows.length} images for product ${productId}`);
        try {
          await executeQuery(async () => {
            return await db.insert(productImages).values(imageRows);
          });
          console.log("Images saved successfully");
          
          // Verify images were saved. This is best-effort only; if the verification
          // query fails (e.g., transient connection issue), we still consider the
          // product creation successful to avoid showing a false error toast
          // to the seller after the product was already inserted.
          try {
            const savedImages = await executeQuery(async () => {
              return await db
                .select()
                .from(productImages)
                .where(eq(productImages.productId, productId));
            });
            console.log(`Verified: ${savedImages.length} images saved for product ${productId}`);
          } catch (verifyError) {
            console.warn("Skipped image verification due to transient error:", verifyError);
          }
        } catch (imgError: any) {
          console.error("Error saving images:", imgError);
          // Check for data truncation errors
          if (imgError.message?.includes("Data too long") || 
              imgError.message?.includes("truncated") ||
              imgError.message?.includes("1406")) {
            throw new Error("Image data is too large. Please use smaller images (under 2MB each).");
          }
          throw imgError;
        }
      } else {
        console.log("No valid images to save after filtering");
      }
    } else {
      console.log("No images provided in request");
    }

    return NextResponse.json({ success: true, product: { ...newProduct, stock: body.stock || 0 } });
  } catch (error: any) {
    console.error("Error creating product:", error);
    
    // Check for database connection errors
    const isConnectionError = 
      error?.cause?.code === "ECONNRESET" ||
      error?.cause?.code === "PROTOCOL_CONNECTION_LOST" ||
      error?.cause?.errno === -4077 ||
      error?.message?.includes("ECONNRESET") ||
      error?.message?.includes("Failed query");

    if (isConnectionError) {
      return NextResponse.json(
        { error: "Database connection error. Please try again." },
        { status: 503 }
      );
    }

    // Provide more specific error message if available
    const errorMessage = error?.message || "Failed to create product";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT /api/sellers/products?id=xxx - Update a product
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = session.user.id;
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");
    
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const body = await req.json();

    // Handle database connection errors with retry
    const executeQuery = async <T>(queryFn: () => Promise<T>, retries = 3): Promise<T> => {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          return await queryFn();
        } catch (error: any) {
          const isConnectionError = 
            error?.cause?.code === "ECONNRESET" ||
            error?.cause?.code === "PROTOCOL_CONNECTION_LOST" ||
            error?.cause?.errno === -4077 ||
            error?.message?.includes("ECONNRESET") ||
            error?.message?.includes("Failed query");

          if (isConnectionError && attempt < retries - 1) {
            const delay = Math.min(100 * Math.pow(2, attempt), 1000);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          throw error;
        }
      }
      throw new Error("Query failed after retries");
    };

    // Get seller's shop
    const sellerShop = await executeQuery(async () => {
      return await db
        .select({ id: shop.id })
        .from(shop)
        .where(eq(shop.sellerId, sellerId))
        .limit(1);
    });

    if (sellerShop.length === 0) {
      return NextResponse.json(
        { error: "No shop found for seller" },
        { status: 400 }
      );
    }

    const shopId = sellerShop[0].id;

    // Verify product belongs to seller's shop
    const existingProduct = await executeQuery(async () => {
      return await db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);
    });

    if (existingProduct.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (existingProduct[0].shopId !== shopId) {
      return NextResponse.json(
        { error: "Unauthorized - product does not belong to your shop" },
        { status: 403 }
      );
    }

    // Validate required fields
    if (body.productName !== undefined && !body.productName.trim()) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }
    if (body.price !== undefined && (body.price === null || body.price < 0)) {
      return NextResponse.json({ error: "Valid price is required" }, { status: 400 });
    }

    // Prepare product updates
    const productStatus = body.status !== undefined ? body.status : existingProduct[0].status;
    const isAvailable = productStatus === "Available";

    const productUpdates: any = {
      updatedAt: new Date(),
    };

    if (body.productName !== undefined) productUpdates.productName = body.productName;
    if (body.description !== undefined) productUpdates.description = body.description || "";
    if (body.categoryId !== undefined) productUpdates.categoryId = body.categoryId;
    if (body.price !== undefined) productUpdates.price = String(body.price);
    if (body.SKU !== undefined) productUpdates.SKU = body.SKU || undefined;
    if (body.status !== undefined) {
      productUpdates.status = productStatus;
      productUpdates.isAvailable = isAvailable;
    }

    // Update product
    await executeQuery(async () => {
      return await db
        .update(products)
        .set(productUpdates)
        .where(eq(products.id, productId));
    });

    // Update inventory if stock is provided
    if (body.stock !== undefined) {
      const existingInventory = await executeQuery(async () => {
        return await db
          .select()
          .from(productInventory)
          .where(eq(productInventory.productId, productId))
          .limit(1);
      });

      if (existingInventory.length > 0) {
        await executeQuery(async () => {
          return await db
            .update(productInventory)
            .set({ quantityInStock: body.stock })
            .where(eq(productInventory.productId, productId));
        });
      } else {
        await executeQuery(async () => {
          return await db.insert(productInventory).values({
            id: uuidv4(),
            productId: productId,
            quantityInStock: body.stock,
            itemsSold: 0,
          });
        });
      }
    }

    // Update images if provided
    if (body.images !== undefined && Array.isArray(body.images)) {
      // Delete existing images
      await executeQuery(async () => {
        return await db
          .delete(productImages)
          .where(eq(productImages.productId, productId));
      });

      // Insert new images
      const imageRows = body.images
        .map((img: { image_url: string }) => {
          const candidate = typeof img.image_url === "string" ? img.image_url : "";
          const safeUrl =
            candidate &&
            (
              candidate.startsWith("http") ||
              candidate.startsWith("/") ||
              candidate.startsWith("data:image/")
            )
              ? candidate
              : "";

          return {
            id: uuidv4(),
            productId: productId,
            url: safeUrl,
          };
        })
        .filter(img => img.url && img.url.trim() !== "");

      if (imageRows.length > 0) {
        await executeQuery(async () => {
          return await db.insert(productImages).values(imageRows);
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating product:", error);
    
    const isConnectionError = 
      error?.cause?.code === "ECONNRESET" ||
      error?.cause?.code === "PROTOCOL_CONNECTION_LOST" ||
      error?.cause?.errno === -4077 ||
      error?.message?.includes("ECONNRESET") ||
      error?.message?.includes("Failed query");

    if (isConnectionError) {
      return NextResponse.json(
        { error: "Database connection error. Please try again." },
        { status: 503 }
      );
    }

    const errorMessage = error?.message || "Failed to update product";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}