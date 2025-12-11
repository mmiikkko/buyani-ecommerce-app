import { NextRequest } from 'next/server';
import { auth } from '@/server/auth';
import { db } from '@/server/drizzle';
import { user } from '@/server/schema/auth-schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { corsResponse, corsOptions } from '@/lib/api-utils';

// OPTIONS /api/auth/mobile-login - Handle CORS preflight
export async function OPTIONS() {
  return corsOptions();
}

// POST /api/auth/mobile-login - Mobile app login endpoint
export async function POST(req: NextRequest) {
  console.log('📱 Mobile login endpoint called');
  try {
    const body = await req.json();
    console.log('📱 Login request for:', body.email);
    const { email, password, role } = body;

    if (!email || !password) {
      return corsResponse(
        { error: 'Email and password are required' },
        400
      );
    }

    // Use Better Auth's API to verify credentials
    // This ensures we use the same password hashing that Better Auth uses
    // Construct the internal URL for Better Auth's sign-in endpoint
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const signInUrl = `${baseUrl}/api/auth/sign-in/email`;
    
    try {
      // Call Better Auth's sign-in endpoint internally
      const signInResponse = await fetch(signInUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!signInResponse.ok) {
        // Try to get error details from Better Auth
        let errorMessage = 'Invalid credentials';
        const responseText = await signInResponse.text();
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData?.message || errorData?.error || errorMessage;
          console.log('📱 Better Auth sign-in error details:', errorData);
        } catch {
          // If response is not JSON, log the text
          console.log('📱 Better Auth sign-in error (non-JSON):', responseText);
        }
        
        return corsResponse(
          { error: errorMessage },
          401
        );
      }

      // Credentials are valid, now get user info and verify role
      const [foundUser] = await db
        .select()
        .from(user)
        .where(eq(user.email, email))
        .limit(1);

      if (!foundUser) {
        return corsResponse(
          { error: 'User not found' },
          404
        );
      }

      // Verify role matches (if provided)
      // Note: USER_ROLES stores values as lowercase: "seller", "customer"
      if (role) {
        const expectedRole = role === 'seller' ? 'seller' : 'customer';
        const userRole = (foundUser.role || '').toLowerCase();
        
        // Check if user role matches expected role
        // Also handle cases where role might be "pending_seller" or "suspended"
        const roleMatches = 
          userRole === expectedRole ||
          (expectedRole === 'seller' && (userRole === 'seller' || userRole === 'pending_seller'));
        
        if (!roleMatches) {
          console.log(`📱 Role mismatch: expected ${expectedRole}, got ${userRole}`);
          return corsResponse(
            { error: 'Invalid role for this account' },
            403
          );
        }
      }

      // Generate JWT token for mobile app
      const jwtSecret = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET || 'your-secret-key';
      const token = jwt.sign(
        { userId: foundUser.id, email: foundUser.email, role: foundUser.role },
        jwtSecret,
        { expiresIn: '7d' }
      );

      return corsResponse({
        message: 'Login successful',
        token,
        user: {
          id: foundUser.id,
          email: foundUser.email,
          role: foundUser.role,
          name: foundUser.name,
          firstName: foundUser.first_name,
          lastName: foundUser.last_name,
        },
      });
    } catch (fetchError: any) {
      console.error('Better Auth sign-in error:', fetchError);
      return corsResponse(
        { error: 'Invalid credentials' },
        401
      );
    }
  } catch (error: any) {
    console.error('Mobile login error:', error);
    return corsResponse(
      { error: 'Login failed', details: error.message },
      500
    );
  }
}

