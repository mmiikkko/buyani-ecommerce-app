import { NextRequest } from "next/server";
import { corsOptions, corsResponse } from "@/lib/api-utils";
import { db } from "@/server/drizzle";
import { user, account, passwordResetCodes } from "@/server/schema/auth-schema";
import { eq, and } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

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

    console.log("🔍 Found user:", foundUser.id, foundUser.email);

    // Check what accounts exist for this user
    const userAccounts = await db
      .select()
      .from(account)
      .where(eq(account.userId, foundUser.id));

    console.log("🔍 User accounts:", userAccounts.map(a => ({
      id: a.id,
      providerId: a.providerId,
      hasPassword: !!a.password
    })));

    // Hash the password using Better Auth's built-in password hasher (scrypt)
    // so that it is 100% compatible with Better Auth sign-in verification.
    const hashedPassword = await hashPassword(newPassword);

    console.log("🔐 Password hashed successfully");

    // Update the password in the account table
    // Try to find account with providerId "credential" first
    const credentialAccount = userAccounts.find(a => a.providerId === "credential");
    
    if (!credentialAccount) {
      console.log("⚠️ No credential account found, checking for email-password account");
      // Better Auth might use "email-password" as providerId
      const emailPasswordAccount = userAccounts.find(a => a.providerId === "email-password");
      
      if (emailPasswordAccount) {
        console.log("✅ Found email-password account, updating...");
        const result = await db
          .update(account)
          .set({ password: hashedPassword })
          .where(eq(account.id, emailPasswordAccount.id));
        console.log("✅ Update result:", result);
      } else {
        console.error("❌ No password-based account found for user");
        return corsResponse(
          { error: "No password account found for this user" },
          400
        );
      }
    } else {
      console.log("✅ Found credential account, updating...");
      const result = await db
        .update(account)
        .set({ password: hashedPassword })
        .where(eq(account.id, credentialAccount.id));
      console.log("✅ Update result:", result);
    }

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

