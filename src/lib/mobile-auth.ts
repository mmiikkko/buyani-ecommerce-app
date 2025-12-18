import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/server/auth';
import { db } from '@/server/drizzle';
import { user, shop, USER_ROLES } from '@/server/schema/auth-schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { getServerSession } from '@/server/session';

/**
 * Unified authentication helper that works for both web (Better Auth sessions) and mobile (JWT tokens)
 * Returns user info with properly determined role based on shop status (like getServerSession does)
 */
export async function getAuthenticatedUser(req?: NextRequest) {
  // Try mobile JWT token first (from Authorization header)
  const authHeader = req?.headers.get('authorization') || (await headers()).get('authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET || 'your-secret-key';
    
    try {
      const decoded = jwt.verify(token, jwtSecret) as any;
      const userId = decoded.userId;
      
      if (!userId) {
        return null;
      }
      
      // Get user from database
      const [foundUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);
      
      if (!foundUser) {
        return null;
      }
      
      // Determine role based on shop status (same logic as getServerSession)
      let userRole = foundUser.role ?? USER_ROLES.CUSTOMER;
      
      // Check shop status to determine seller role
      const [shopRow] = await db
        .select({ status: shop.status })
        .from(shop)
        .where(eq(shop.sellerId, foundUser.id))
        .limit(1);
      
      const shopStatus = shopRow?.status;
      
      if (shopStatus === 'suspended') {
        userRole = USER_ROLES.SUSPENDED;
      } else if (shopStatus === 'approved') {
        userRole = USER_ROLES.SELLER;
      } else if (shopStatus === 'pending') {
        userRole = USER_ROLES.PENDING_SELLER;
      } else if (!shopStatus && userRole === USER_ROLES.SELLER) {
        // If user was a seller but has no shop, fallback to customer
        userRole = USER_ROLES.CUSTOMER;
      }
      
      return {
        id: foundUser.id,
        email: foundUser.email,
        role: userRole,
        name: foundUser.name,
        firstName: foundUser.first_name,
        lastName: foundUser.last_name,
        image: foundUser.image,
      };
    } catch (error) {
      // Invalid JWT token, fall through to try web session
      console.log('JWT token validation failed, trying web session...');
    }
  }
  
  // Fall back to web session (Better Auth)
  try {
    const session = await getServerSession();
    if (session?.user) {
      return {
        id: session.user.id,
        email: session.user.email || '',
        role: session.user.role?.[0] || USER_ROLES.CUSTOMER,
        name: session.user.name || null,
        firstName: null,
        lastName: null,
        image: session.user.image || null,
      };
    }
  } catch (error) {
    console.error('Error getting web session:', error);
  }
  
  return null;
}

