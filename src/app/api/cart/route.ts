import { NextRequest } from 'next/server';
import { db } from '@/server/drizzle';
import { carts, cartItems, products, productImages, productVariation } from '@/server/schema/auth-schema';
import { eq, and, inArray } from 'drizzle-orm';
import { getServerSession } from '@/server/session';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { corsResponse, corsOptions } from '@/lib/api-utils';

// Allow both cookie sessions (web) and Bearer JWT (mobile)
async function getUserId(req: NextRequest): Promise<string | null> {
  // Try JWT token first (for mobile apps) - more reliable in API routes
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET || 'your-secret-key';
    try {
      const decoded = jwt.verify(token, jwtSecret) as { userId?: string };
      if (decoded.userId) {
        console.log('Cart: JWT token verified, userId:', decoded.userId);
        return decoded.userId;
      } else {
        console.error('Cart: JWT token decoded but no userId found');
      }
    } catch (error) {
      console.error('Cart: JWT verification failed:', error instanceof Error ? error.message : error);
    }
  } else {
    console.log('Cart: No Bearer token found in authorization header');
  }

  // Fall back to session (for web apps)
  try {
    const session = await getServerSession();
    if (session?.user?.id) {
      console.log('Cart: Session found, userId:', session.user.id);
      return session.user.id;
    }
  } catch (error) {
    console.error('Cart: Session retrieval failed:', error instanceof Error ? error.message : error);
  }

  console.log('Cart: No userId found from either JWT or session');
  return null;
}

// OPTIONS /api/cart - Handle CORS preflight
export async function OPTIONS() {
  return corsOptions();
}

// GET /api/cart - Get cart items for the current user
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      console.error('Cart GET: Unauthorized - no userId');
      return corsResponse({ error: 'Unauthorized', message: 'Please log in to access your cart' }, 401);
    }

    console.log(`Cart GET: Fetching cart for userId: ${userId}`);

    // Get or create cart for THIS SPECIFIC USER
    const existingCart = await db
      .select()
      .from(carts)
      .where(eq(carts.buyerId, userId)) // Filter by userId to ensure user-specific cart
      .limit(1);

    let cartId: string;
    if (existingCart.length > 0) {
      cartId = existingCart[0].id;
    } else {
      cartId = uuidv4();
      await db.insert(carts).values({
        id: cartId,
        buyerId: userId,
      });
    }

    // Get cart items with product and variation information
    const items = await db
      .select({
        id: cartItems.id,
        productVariationId: cartItems.productVariationId,
        productId: productVariation.productId,
        quantity: cartItems.quantity,
        productName: products.productName,
        price: productVariation.price,
        description: products.description,
        variationName: productVariation.variationName,
        variationValue: productVariation.variationValue,
      })
      .from(cartItems)
      .leftJoin(productVariation, eq(cartItems.productVariationId, productVariation.id))
      .leftJoin(products, eq(productVariation.productId, products.id))
      .where(eq(cartItems.cartId, cartId));

    // Get product images
    const productIds = [...new Set(items.map((i) => i.productId).filter(Boolean))] as string[];
    const images = productIds.length > 0
      ? await db
        .select({
          productId: productImages.productId,
          url: productImages.url,
        })
        .from(productImages)
        .where(inArray(productImages.productId, productIds))
      : [];

    // Create image map
    const imageMap = new Map<string, string | null>();
    for (const img of images) {
      if (img.productId && !imageMap.has(img.productId)) {
        imageMap.set(img.productId, img.url);
      }
    }

    const cartItemsWithImages = items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productVariationId: item.productVariationId,
      quantity: item.quantity,
      productName: item.productName,
      price: item.price ? parseFloat(String(item.price)) : 0,
      description: item.description || null,
      variationName: item.variationName,
      variationValue: item.variationValue,
      image: item.productId ? imageMap.get(item.productId) : null,
    }));

    return corsResponse(cartItemsWithImages);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return corsResponse({ error: 'Failed to fetch cart' }, 500);
  }
}

// POST /api/cart - Add item to cart
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      console.error('Cart POST: No userId found - check auth header and session');
      return corsResponse({ error: 'Unauthorized' }, 401);
    }

    const body = await req.json();
    const { productVariationId, quantity = 1 } = body;

    if (!productVariationId) {
      return corsResponse({ error: 'Product Variation ID is required' }, 400);
    }

    // Get or create cart
    const existingCart = await db
      .select()
      .from(carts)
      .where(eq(carts.buyerId, userId))
      .limit(1);

    let cartId: string;
    if (existingCart.length > 0) {
      cartId = existingCart[0].id;
    } else {
      cartId = uuidv4();
      await db.insert(carts).values({
        id: cartId,
        buyerId: userId,
      });
    }

    // Check if item already exists in cart
    const existingItem = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, cartId),
          eq(cartItems.productVariationId, productVariationId)
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
        id: uuidv4(),
        cartId,
        productVariationId,
        quantity,
      });
    }
    console.log(`Cart: Item added/updated for cart ${cartId}`);

    return corsResponse({ success: true, message: 'Item added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return corsResponse({ error: 'Failed to add item to cart' }, 500);
  }
}

// DELETE /api/cart?id=xxx - Remove item from cart
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return corsResponse({ error: 'Unauthorized' }, 401);
    }

    const { searchParams } = new URL(req.url);
    const cartItemId = searchParams.get('id');

    if (!cartItemId) {
      return corsResponse({ error: 'Cart item ID is required' }, 400);
    }

    // Get cart
    const existingCart = await db
      .select()
      .from(carts)
      .where(eq(carts.buyerId, userId))
      .limit(1);

    if (existingCart.length === 0) {
      return corsResponse({ error: 'Cart not found' }, 404);
    }

    // Delete cart item
    await db
      .delete(cartItems)
      .where(
        and(
          eq(cartItems.id, cartItemId),
          eq(cartItems.cartId, existingCart[0].id)
        )
      );

    return corsResponse({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return corsResponse({ error: 'Failed to remove item from cart' }, 500);
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return corsResponse({ error: 'Unauthorized' }, 401);
    }

    const body = await req.json();
    const { id: cartItemId, quantity } = body;

    if (!cartItemId || quantity === undefined) {
      return corsResponse({ error: 'Cart item ID and quantity are required' }, 400);
    }

    if (quantity <= 0) {
      return corsResponse({ error: 'Quantity must be greater than 0' }, 400);
    }

    // Get cart
    const existingCart = await db
      .select()
      .from(carts)
      .where(eq(carts.buyerId, userId))
      .limit(1);

    if (existingCart.length === 0) {
      return corsResponse({ error: 'Cart not found' }, 404);
    }

    // Update quantity
    await db
      .update(cartItems)
      .set({ quantity })
      .where(
        and(
          eq(cartItems.id, cartItemId),
          eq(cartItems.cartId, existingCart[0].id)
        )
      );

    return corsResponse({ success: true, message: 'Cart item updated' });
  } catch (error) {
    console.error('Error updating cart:', error);
    return corsResponse({ error: 'Failed to update cart item' }, 500);
  }
}

