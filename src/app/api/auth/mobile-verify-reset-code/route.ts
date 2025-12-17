import { NextRequest } from "next/server";
import { corsOptions, corsResponse } from "@/lib/api-utils";
import { db } from "@/server/drizzle";
import { passwordResetCodes } from "@/server/schema/auth-schema";
import { eq, and, gt } from "drizzle-orm";

// OPTIONS /api/auth/mobile-verify-reset-code - Handle CORS preflight
export async function OPTIONS() {
  return corsOptions();
}

// POST /api/auth/mobile-verify-reset-code - Verify the 6-digit reset code
export async function POST(req: NextRequest) {
  console.log("📱 Mobile verify reset code endpoint called");
  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return corsResponse({ error: "Email and code are required" }, 400);
    }

    // Find the most recent valid code for this email
    const [resetCode] = await db
      .select()
      .from(passwordResetCodes)
      .where(
        and(
          eq(passwordResetCodes.email, email),
          eq(passwordResetCodes.code, code),
          eq(passwordResetCodes.verified, false),
          gt(passwordResetCodes.expiresAt, new Date())
        )
      )
      .orderBy(passwordResetCodes.createdAt)
      .limit(1);

    if (!resetCode) {
      return corsResponse(
        { error: "Invalid or expired code. Please try again." },
        400
      );
    }

    // Mark the code as verified
    await db
      .update(passwordResetCodes)
      .set({ verified: true })
      .where(eq(passwordResetCodes.id, resetCode.id));

    console.log("✅ Reset code verified for:", email);

    return corsResponse(
      {
        success: true,
        message: "Code verified successfully.",
        codeId: resetCode.id, // Return the ID to use when resetting password
      },
      200
    );
  } catch (error) {
    console.error("❌ Verify code error:", error);
    return corsResponse(
      { error: "An error occurred. Please try again." },
      500
    );
  }
}

