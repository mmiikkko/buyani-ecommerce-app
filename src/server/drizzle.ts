import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import type { EventEmitter } from "events";

// Declare global type for the pool to persist across hot reloads
declare global {
  // eslint-disable-next-line no-var
  var mysqlPool: mysql.Pool | undefined;
}

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
      connectionLimit: 5, // Reduced for development
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      connectTimeout: 60000, // 60 seconds
      waitForConnections: true,
      // Add idle timeout to close idle connections
      idleTimeout: 60000, // 1 minute (reduced for dev)
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
        connectionLimit: 5,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        connectTimeout: 60000,
        waitForConnections: true,
        idleTimeout: 60000,
      };
    } catch (parseError) {
      console.error("Failed to parse DB_URI:", parseError);
      throw new Error(`Invalid DB_URI format: ${process.env.DB_URI}`);
    }
  }
}

// Use global singleton pattern to prevent multiple pools during hot reload
function getPool(): mysql.Pool {
  if (global.mysqlPool) {
    return global.mysqlPool;
  }

  const config = getConnectionConfig();
  const pool = mysql.createPool(config);

  // Handle pool-level errors
  (pool as unknown as EventEmitter).on("error", (err: NodeJS.ErrnoException) => {
    console.error("MySQL pool error:", err);

    if (
      err.code === "PROTOCOL_CONNECTION_LOST" ||
      err.code === "ECONNRESET" ||
      err.code === "ETIMEDOUT"
    ) {
      console.log("Pool connection lost, will reconnect automatically");
    }
  });

  // Test the connection asynchronously (non-blocking)
  pool.getConnection()
    .then((connection) => {
      console.log("✓ Database connection pool initialized successfully");
      connection.release();
    })
    .catch((err) => {
      console.error("✗ Failed to initialize database connection pool:", err.message);
    });

  // Store in global to reuse across hot reloads in development
  if (process.env.NODE_ENV !== "production") {
    global.mysqlPool = pool;
  }

  return pool;
}

const pool = getPool();
export const db = drizzle(pool);
