import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { user, account } from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";

// GET /api/auth/debug-account?email=xxx - Debug account info
export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Find the user
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!foundUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all accounts for this user
    const userAccounts = await db
      .select({
        id: account.id,
        providerId: account.providerId,
        accountId: account.accountId,
        hasPassword: account.password,
      })
      .from(account)
      .where(eq(account.userId, foundUser.id));

    return NextResponse.json({
      user: {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
      },
      accounts: userAccounts.map(a => ({
        id: a.id,
        providerId: a.providerId,
        accountId: a.accountId,
        hasPassword: !!a.hasPassword,
        passwordLength: a.hasPassword ? a.hasPassword.length : 0,
      })),
    });
  } catch (error) {
    console.error("❌ Debug error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}

