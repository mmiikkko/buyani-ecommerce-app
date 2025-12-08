import { headers } from "next/headers";
import { auth } from "./auth";
import { cache } from "react";

export const getServerSession = cache(async () => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    return session;
  } catch (error: any) {
    const isConnectionError =
      error?.cause?.code === "ECONNRESET" ||
      error?.cause?.code === "PROTOCOL_CONNECTION_LOST" ||
      error?.cause?.code === "ETIMEDOUT" ||
      error?.cause?.errno === -4077 || // ECONNRESET errno on Windows
      error?.message?.includes("ECONNRESET") ||
      error?.message?.includes("Connection lost") ||
      error?.message?.includes("Failed query");

    // Only log unexpected non-connection issues; otherwise stay silent
    if (!isConnectionError && error?.message) {
      console.warn("Session error:", error.message);
    }

    // Never throw from here; let pages render unauthenticated
    return null;
  }
});
