import { NextRequest } from "next/server";
import { corsOptions, corsResponse } from "@/lib/api-utils";
import { db } from "@/server/drizzle";
import { user, account, passwordResetCodes } from "@/server/schema/auth-schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";

// OPTIONS /api/auth/mobile-reset-password - Handle CORS preflight
export async function OPTIONS() {
  return corsOptions();
}

// POST /api/auth/mobile-reset-password - Reset password using verified code
export async function POST(req: NextRequest) {
  console.log("📱 Mobile reset password endpoint called");
  try {
    const body = await req.json();
    const { email, code, newPassword } = body;

    if (!email || !code || !newPassword) {
      return corsResponse(
        { error: "Email, code, and new password are required" },
        400
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return corsResponse(
        { error: "Password must be at least 8 characters long" },
        400
      );
    }

    // Verify the code is verified and still valid
    const [resetCode] = await db
      .select()
      .from(passwordResetCodes)
      .where(
        and(
          eq(passwordResetCodes.email, email),
          eq(passwordResetCodes.code, code),
          eq(passwordResetCodes.verified, true)
        )
      )
      .orderBy(passwordResetCodes.createdAt)
      .limit(1);

    if (!resetCode) {
      return corsResponse(
        { error: "Invalid code. Please verify your code first." },
        400
      );
    }

    // Find the user
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!foundUser) {
      return corsResponse({ error: "User not found" }, 404);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the account table
    await db
      .update(account)
      .set({ password: hashedPassword })
      .where(
        and(
          eq(account.userId, foundUser.id),
          eq(account.providerId, "credential")
        )
      );

    // Delete the used reset code
    await db
      .delete(passwordResetCodes)
      .where(eq(passwordResetCodes.id, resetCode.id));

    console.log("✅ Password reset successfully for:", email);

    return corsResponse(
      {
        success: true,
        message: "Password has been reset successfully. You can now log in.",
      },
      200
    );
  } catch (error) {
    console.error("❌ Reset password error:", error);
    return corsResponse(
      { error: "An error occurred. Please try again." },
      500
    );
  }
}

