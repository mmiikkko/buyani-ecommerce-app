import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import { db } from '@/server/drizzle';
import { user, account } from '@/server/schema/auth-schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
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

    // Find user by email
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!foundUser) {
      return corsResponse(
        { error: 'Invalid credentials' },
        401
      );
    }

    // Find account with password
    const [userAccount] = await db
      .select()
      .from(account)
      .where(eq(account.userId, foundUser.id))
      .limit(1);

    if (!userAccount || !userAccount.password) {
      return corsResponse(
        { error: 'Invalid credentials' },
        401
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userAccount.password);
    if (!isValidPassword) {
      return corsResponse(
        { error: 'Invalid credentials' },
        401
      );
    }

    // Verify role matches (if provided)
    if (role) {
      const expectedRole = role === 'seller' ? 'SELLER' : 'CUSTOMER';
      const userRole = foundUser.role || '';
      if (!userRole.includes(expectedRole)) {
        return corsResponse(
          { error: 'Invalid role for this account' },
          403
        );
      }
    }

    // Generate JWT token
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
  } catch (error: any) {
    console.error('Mobile login error:', error);
    return corsResponse(
      { error: 'Login failed', details: error.message },
      500
    );
  }
}

