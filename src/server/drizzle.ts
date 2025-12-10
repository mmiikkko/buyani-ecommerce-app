import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// Parse connection URI and convert to connection options
function getConnectionConfig(): mysql.PoolOptions {
  if (!process.env.DB_URI) {
    throw new Error("DB_URI environment variable is not set");
  }

  try {
    const url = new URL(process.env.DB_URI);
    
    // Remove ssl-mode parameter (not supported by mysql2)
    url.searchParams.delete("ssl-mode");
    
    // Decode URL-encoded username and password (handles special characters)
    const username = decodeURIComponent(url.username || "");
    const password = decodeURIComponent(url.password || "");
    
    // Extract database name from pathname (remove leading '/')
    const database = url.pathname.slice(1) || undefined;
    
    // Extract connection parameters from URI
    const config: mysql.PoolOptions = {
      host: url.hostname || "localhost",
      port: url.port ? parseInt(url.port, 10) : 3306,
      user: username,
      password: password,
      database: database,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      connectTimeout: 60000, // 60 seconds
      waitForConnections: true,
      // Add idle timeout to close idle connections
      idleTimeout: 600000, // 10 minutes
    };

    // Handle SSL if present in query params
    const sslParam = url.searchParams.get("ssl");
    if (sslParam === "true" || sslParam === "1") {
      config.ssl = { rejectUnauthorized: false };
    }

    return config;
  } catch (error) {
    // If URL parsing fails, try to extract from connection string format
    const cleanedUri = process.env.DB_URI.replace(/[?&]ssl-mode=[^&]*/gi, "");
    
    // Fallback: try to parse again
    try {
      const url = new URL(cleanedUri);
      const username = decodeURIComponent(url.username || "");
      const password = decodeURIComponent(url.password || "");
      const database = url.pathname.slice(1) || undefined;
      
      return {
        host: url.hostname || "localhost",
        port: url.port ? parseInt(url.port, 10) : 3306,
        user: username,
        password: password,
        database: database,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        connectTimeout: 60000,
        waitForConnections: true,
        idleTimeout: 600000,
      };
    } catch (parseError) {
      console.error("Failed to parse DB_URI:", parseError);
      throw new Error(`Invalid DB_URI format: ${process.env.DB_URI}`);
    }
  }
}

// Create pool with parsed connection options
// Note: mysql2 pool automatically handles reconnections
let pool: mysql.Pool;

try {
  const config = getConnectionConfig();
  pool = mysql.createPool(config);
  
  // Test the connection asynchronously (non-blocking)
  // This helps identify connection issues early without blocking startup
  pool.getConnection()
    .then((connection) => {
      console.log("✓ Database connection pool initialized successfully");
      connection.release();
    })
    .catch((err) => {
      console.error("✗ Failed to initialize database connection pool:", err.message);
      // Don't throw - let the pool try to reconnect on first use
    });
} catch (error) {
  console.error("Error creating database pool:", error);
  throw error;
}

// Handle pool-level errors (these are different from connection errors)
// Note: mysql2/promise Pool extends EventEmitter and supports error events
pool.on("error", (err: NodeJS.ErrnoException) => {
  console.error("MySQL pool error:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ECONNRESET" || err.code === "ETIMEDOUT") {
    console.log("Pool connection lost, will reconnect automatically");
  }
});

export const db = drizzle(pool);
