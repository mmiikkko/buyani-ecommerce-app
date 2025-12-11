import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/drizzle';
import { user, shop, account } from '@/server/schema/auth-schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { corsResponse, corsOptions } from '@/lib/api-utils';

// OPTIONS /api/auth/mobile-me - Handle CORS preflight
export async function OPTIONS() {
  return corsOptions();
}

// GET /api/auth/mobile-me - Get current user info using JWT token
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return corsResponse(
        { error: 'Unauthorized' },
        401
      );
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET || 'your-secret-key';

    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (error) {
      return corsResponse(
        { error: 'Invalid token' },
        401
      );
    }

    const userId = decoded.userId;
    if (!userId) {
      return corsResponse(
        { error: 'Invalid token' },
        401
      );
    }

    // Get user info
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!foundUser) {
      return corsResponse(
        { error: 'User not found' },
        404
      );
    }

    // Check if user has a shop
    const [userShop] = await db
      .select()
      .from(shop)
      .where(eq(shop.sellerId, userId))
      .limit(1);

    return corsResponse({
      id: foundUser.id,
      name: foundUser.name,
      firstName: foundUser.first_name,
      lastName: foundUser.last_name,
      email: foundUser.email,
      role: foundUser.role,
      emailVerified: foundUser.emailVerified,
      image: foundUser.image,
      hasShop: !!userShop,
      shop: userShop ? {
        id: userShop.id,
        shopName: userShop.shopName,
        status: userShop.status,
      } : null,
    });
  } catch (error: any) {
    console.error('Error fetching mobile user info:', error);
    return corsResponse(
      { error: 'Failed to fetch user info', details: error.message },
      500
    );
  }
}

