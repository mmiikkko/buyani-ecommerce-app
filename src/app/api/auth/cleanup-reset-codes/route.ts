import { NextRequest } from "next/server";
import { db } from "@/server/drizzle";
import { passwordResetCodes } from "@/server/schema/auth-schema";
import { lt } from "drizzle-orm";

// This endpoint can be called periodically to clean up expired reset codes
// You can set up a cron job to call this endpoint
export async function POST(req: NextRequest) {
  try {
    // Delete all expired reset codes
    const result = await db
      .delete(passwordResetCodes)
      .where(lt(passwordResetCodes.expiresAt, new Date()));

    console.log("✅ Cleaned up expired reset codes");

    return Response.json({
      success: true,
      message: "Expired reset codes cleaned up successfully",
    });
  } catch (error) {
    console.error("❌ Cleanup error:", error);
    return Response.json(
      { error: "Failed to cleanup expired codes" },
      { status: 500 }
    );
  }
}

