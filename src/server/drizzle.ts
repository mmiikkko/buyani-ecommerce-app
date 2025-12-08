import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// Parse connection string and remove unsupported ssl-mode parameter
function getCleanConnectionUri(): string {
  if (!process.env.DB_URI) {
    throw new Error("DB_URI environment variable is not set");
  }

  try {
    const url = new URL(process.env.DB_URI);
    
    // Remove ssl-mode parameter (not supported by mysql2)
    url.searchParams.delete("ssl-mode");
    
    // Return cleaned URI
    return url.toString();
  } catch {
    // If URL parsing fails, return original URI
    // This handles cases where DB_URI might not be a full URL
    return process.env.DB_URI.replace(/[?&]ssl-mode=[^&]*/gi, "");
  }
}

// Create pool with cleaned connection string and proper configuration
// Note: mysql2 pool automatically handles reconnections, so reconnect option is not needed
const pool = mysql.createPool({
  uri: getCleanConnectionUri(),
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Add timeout settings to prevent hanging connections
  connectTimeout: 60000, // 60 seconds
});

// Handle pool errors
pool.on("connection", (connection) => {
  connection.on("error", (err) => {
    console.error("MySQL connection error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ECONNRESET") {
      // Connection was lost, pool will handle reconnection
      console.log("Connection lost, pool will reconnect");
    }
  });
});

export const db = drizzle(pool);
