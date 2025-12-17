import { NextRequest } from "next/server";
import { corsOptions, corsResponse } from "@/lib/api-utils";
import { db } from "@/server/drizzle";
import { user, passwordResetCodes } from "@/server/schema/auth-schema";
import { eq, and, gt } from "drizzle-orm";
import { randomUUID } from "crypto";
import { sendMail } from "@/server/mailer";

// OPTIONS /api/auth/mobile-forgot-password - Handle CORS preflight
export async function OPTIONS() {
  return corsOptions();
}

// Generate a random 6-digit code
function generateSixDigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/mobile-forgot-password - Request password reset with 6-digit code
export async function POST(req: NextRequest) {
  console.log("📱 Mobile forgot password endpoint called");
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return corsResponse({ error: "Email is required" }, 400);
    }

    // Check if user exists
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    // For security, we don't reveal if the email exists or not
    // But we only send email if it exists
    if (foundUser) {
      // Generate 6-digit code
      const code = generateSixDigitCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Save the code to database
      await db.insert(passwordResetCodes).values({
        id: randomUUID(),
        email,
        code,
        expiresAt,
        verified: false,
      });

      // Send email with the code
      try {
        await sendMail({
          to: email,
          subject: "Password Reset Code - Buyani",
          text: `Your password reset code is: ${code}\n\nThis code will expire in 15 minutes.\n\nIf you didn't request this, please ignore this email.`,
        });
        console.log("✅ Password reset code sent to:", email);
      } catch (emailError) {
        console.error("❌ Failed to send email:", emailError);
        return corsResponse(
          { error: "Failed to send reset code. Please try again." },
          500
        );
      }
    }

    // Always return success for security (don't reveal if email exists)
    return corsResponse(
      {
        success: true,
        message: "If that email is registered, a reset code has been sent.",
      },
      200
    );
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    return corsResponse(
      { error: "An error occurred. Please try again." },
      500
    );
  }
}

