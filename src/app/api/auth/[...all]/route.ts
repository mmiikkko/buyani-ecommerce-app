import { auth } from "@/server/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

const handler = toNextJsHandler(auth);

// Handle Better Auth routes
// Note: Specific routes like /mobile-login should take precedence in Next.js App Router
export const { POST, GET } = handler;
