import { headers } from "next/headers";
import { auth } from "./auth";
import { cache } from "react";

export const getServerSession = cache(async () => {
  const maxRetries = 3;
  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const session = await auth.api.getSession({ headers: await headers() });
      return session;
    } catch (error: any) {
      lastError = error;
      
      // Check for database connection errors
      const isConnectionError = 
        error?.cause?.code === "ECONNRESET" ||
        error?.cause?.code === "PROTOCOL_CONNECTION_LOST" ||
        error?.cause?.code === "ETIMEDOUT" ||
        error?.cause?.errno === -4077 || // ECONNRESET errno on Windows
        error?.message?.includes("ECONNRESET") ||
        error?.message?.includes("Connection lost") ||
        error?.message?.includes("Failed query");

      if (isConnectionError && attempt < maxRetries - 1) {
        // Wait before retrying (exponential backoff)
        const delay = Math.min(100 * Math.pow(2, attempt), 1000);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // If it's not a connection error or we've exhausted retries, silently return null
      // Don't log errors for missing/invalid sessions as this is expected behavior
      if (!isConnectionError) {
        // Only log if it's a real unexpected error (not just missing session)
        if (error?.message && !error.message.includes("session") && !error.message.includes("token")) {
          console.warn("Session error (non-connection):", error?.message);
        }
        return null;
      }
    }
  }

  // All retries failed - silently return null to allow page to render
  // Connection errors are expected in some scenarios
  return null;
});
