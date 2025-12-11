import { NextRequest } from 'next/server';
import { auth } from '@/server/auth';
import { db } from '@/server/drizzle';
import { user, account, shop, USER_ROLES } from '@/server/schema/auth-schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { corsResponse, corsOptions } from '@/lib/api-utils';
import { randomUUID } from 'crypto';

// OPTIONS /api/auth/mobile-register - Handle CORS preflight
export async function OPTIONS() {
  return corsOptions();
}

// POST /api/auth/mobile-register - Mobile app registration endpoint
export async function POST(req: NextRequest) {
  console.log('📱 Mobile register endpoint called');
  try {
    const body = await req.json();
    console.log('📱 Registration request for:', body.email);
    const {
      email,
      password,
      username,
      firstName,
      lastName,
      name,
      role,
      storeName,
      ownerName,
      phoneNumber,
      businessCategory,
    } = body;

    if (!email || !password) {
      return corsResponse(
        { error: 'Email and password are required' },
        400
      );
    }

    if (role === 'seller' && (!storeName || !ownerName || !phoneNumber || !businessCategory)) {
      return corsResponse(
        { error: 'All seller fields are required' },
        400
      );
    }

    if (role === 'customer' && (!username || !firstName || !lastName)) {
      return corsResponse(
        { error: 'Username, first name, and last name are required' },
        400
      );
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);
    
    if (existingUser) {
      return corsResponse(
        { error: 'Email already registered' },
        400
      );
    }

    // Use Better Auth's API to create the user account
    // This ensures we use the same password hashing that Better Auth uses
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const signUpUrl = `${baseUrl}/api/auth/sign-up/email`;

    try {
      // Determine user name
      const userName = role === 'customer'
        ? (username || `${firstName} ${lastName}`.trim() || email)
        : ownerName;

      // Call Better Auth's sign-up endpoint
      const signUpResponse = await fetch(signUpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name: userName,
          first_name: role === 'customer' ? firstName : undefined,
          last_name: role === 'customer' ? lastName : undefined,
        }),
      });

      if (!signUpResponse.ok) {
        // Try to get error details from Better Auth
        let errorMessage = 'Registration failed';
        const responseText = await signUpResponse.text();
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData?.message || errorData?.error || errorMessage;
          console.log('📱 Better Auth sign-up error details:', errorData);
        } catch {
          console.log('📱 Better Auth sign-up error (non-JSON):', responseText);
        }

        return corsResponse(
          { error: errorMessage },
          400
        );
      }

      // Get the created user
      const [foundUser] = await db
        .select()
        .from(user)
        .where(eq(user.email, email))
        .limit(1);

      if (!foundUser) {
        return corsResponse(
          { error: 'User created but not found' },
          500
        );
      }

      // Update user role
      const userRole = role === 'seller' ? USER_ROLES.SELLER : USER_ROLES.CUSTOMER;
      await db
        .update(user)
        .set({ role: userRole })
        .where(eq(user.id, foundUser.id));

      // If seller, create shop
      if (role === 'seller' && storeName) {
        const shopId = randomUUID();
        await db.insert(shop).values({
          id: shopId,
          sellerId: foundUser.id,
          shopName: storeName,
          description: businessCategory ? `Category: ${businessCategory}` : null,
          status: 'pending', // New shops start as pending
        });
      }

      // Generate JWT token for mobile app
      const jwtSecret = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET || 'your-secret-key';
      const token = jwt.sign(
        { userId: foundUser.id, email: foundUser.email, role: userRole },
        jwtSecret,
        { expiresIn: '7d' }
      );

      return corsResponse({
        message: 'User registered successfully',
        token,
        user: {
          id: foundUser.id,
          email: foundUser.email,
          role: userRole,
          name: userName,
          firstName: foundUser.first_name,
          lastName: foundUser.last_name,
        },
      }, 201);
    } catch (fetchError: any) {
      console.error('Better Auth sign-up error:', fetchError);
      return corsResponse(
        { error: 'Registration failed', details: fetchError.message },
        500
      );
    }
  } catch (error: any) {
    console.error('Mobile registration error:', error);
    return corsResponse(
      { error: 'Registration failed', details: error.message },
      500
    );
  }
}

