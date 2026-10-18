
import { Pool } from "pg";
import dotenv from "dotenv";

// Load environment variables from the .env file.
const envResult = dotenv.config();

// Debug: check whether .env was loaded successfully.
console.log(
  "Loaded .env path:",
  envResult?.parsed ? "Found" : "Not found"
);

// Check whether DATABASE_URL exists without printing its value.
console.log(
  "DATABASE_URL exists:",
  Boolean(process.env.DATABASE_URL)
);

// Debug: inspect database connection details without exposing credentials.
if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);

  console.log("DB username:", url.username);
  console.log("DB host:", url.hostname);
  console.log("DB port:", url.port);
  console.log("DB name:", url.pathname);
}

// Create a PostgreSQL connection pool.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // Allow up to 10 pooled database connections.
});
