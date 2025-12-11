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

      // Get user role and log for debugging
      const userRole = (foundUser.role || '').toLowerCase();
      console.log(`📱 Login attempt for ${email}, user role: ${userRole}, requested role: ${role || 'none'}`);
      
      // Block only suspended users
      if (userRole === 'suspended') {
        console.log(`📱 Suspended user ${email} attempted to log in - blocked`);
        return corsResponse(
          { error: 'Your account has been suspended. Please contact support.' },
          403
        );
      }
      
      // Note: Admin users can log in, but the mobile app will only show Customer/Seller features
      // The Admin role is ignored in the mobile app - admin features are web-only
      console.log(`📱 Login successful for ${email}, user role: ${userRole}`);

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

