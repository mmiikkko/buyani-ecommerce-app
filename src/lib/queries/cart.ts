"use server";

import { db } from "@/server/drizzle";
import { carts, cartItems, products, productImages } from "@/server/schema/auth-schema";
import { eq, and, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuid } from "uuid";

export async function getOrCreateCart(buyerId: string) {
  try {
    // Try to get existing cart
    const existingCart = await db
      .select()
      .from(carts)
      .where(eq(carts.buyerId, buyerId))
      .limit(1);

    if (existingCart.length > 0) {
      return existingCart[0];
    }

    // Create new cart if doesn't exist
    const cartId = uuid();
    await db.insert(carts).values({
      id: cartId,
      buyerId,
    });

    // Fetch the newly created cart
    const newCart = await db
      .select()
      .from(carts)
      .where(eq(carts.id, cartId))
      .limit(1);

    return newCart[0] || { id: cartId, buyerId };
  } catch (error) {
    console.error("Error in getOrCreateCart:", error);
    throw error;
  }
}

export async function getCartItems(buyerId: string) {
  try {
    const cart = await getOrCreateCart(buyerId);
    
    if (!cart?.id) {
      return [];
    }

    // First, get cart items with product information
    const items = await db
      .select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        productName: products.productName,
        price: products.price,
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cart.id));

    if (!items || items.length === 0) {
      return [];
    }

    // Get unique product IDs
    const productIds = [...new Set(items.map(item => item.productId).filter(Boolean))] as string[];
    
    // Fetch all images for these products
    const allImages = productIds.length > 0 ? await db
      .select({
        productId: productImages.productId,
        url: productImages.url,
      })
      .from(productImages)
      .where(inArray(productImages.productId, productIds)) : [];

    // Create a map of productId -> first image URL
    const imageMap = new Map<string, string | null>();
    for (const img of allImages) {
      if (img.productId && !imageMap.has(img.productId)) {
        imageMap.set(img.productId, img.url);
      }
    }

    // Combine items with their images
    return items.map(item => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      productName: item.productName,
      price: item.price ? parseFloat(String(item.price)) : 0,
      image: item.productId ? imageMap.get(item.productId) || null : null,
    }));
  } catch (error) {
    console.error("Error fetching cart items:", error);
    // Return empty array on error instead of throwing
    return [];
  }
}

export async function addToCart(
  buyerId: string,
  productId: string,
  quantity: number = 1
) {
  try {
    // Validate product ID is not a placeholder
    if (productId.startsWith("PlaceHolder") || productId.includes("PlaceHolder")) {
      return { 
        success: false, 
        error: "Cannot add placeholder product to cart. Please select a real product." 
      };
    }

    const cart = await getOrCreateCart(buyerId);

    // Check if item already exists in cart
    const existingItem = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, cart.id),
          eq(cartItems.productId, productId)
        )
      )
      .limit(1);

    if (existingItem.length > 0) {
      // Update quantity
      await db
        .update(cartItems)
        .set({ quantity: existingItem[0].quantity + quantity })
        .where(eq(cartItems.id, existingItem[0].id));
    } else {
      // Add new item
      await db.insert(cartItems).values({
        id: uuid(),
        cartId: cart.id,
        productId,
        quantity,
      });
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    
    // Check for foreign key constraint error
    if (error?.code === 'ER_NO_REFERENCED_ROW_2' || error?.errno === 1452) {
      return { 
        success: false, 
        error: "The product does not exist in the database. Please select a valid product." 
      };
    }
    
    return { 
      success: false, 
      error: error?.message || "Failed to add item to cart. Please try again." 
    };
  }
}

export async function removeFromCart(buyerId: string, cartItemId: string) {
  try {
    const cart = await getOrCreateCart(buyerId);

    await db
      .delete(cartItems)
      .where(
        and(
          eq(cartItems.id, cartItemId),
          eq(cartItems.cartId, cart.id)
        )
      );

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { success: false, error: "Failed to remove item from cart" };
  }
}

export async function updateCartItemQuantity(
  buyerId: string,
  cartItemId: string,
  quantity: number
) {
  try {
    if (quantity <= 0) {
      return removeFromCart(buyerId, cartItemId);
    }

    const cart = await getOrCreateCart(buyerId);

    await db
      .update(cartItems)
      .set({ quantity })
      .where(
        and(
          eq(cartItems.id, cartItemId),
          eq(cartItems.cartId, cart.id)
        )
      );

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return { success: false, error: "Failed to update cart item" };
  }
}

