import { pool } from "../lib/db";
import { DBUserRow, DBUserWithPasswordRow, User } from "../types/user";

// Find a user by email without retrieving the password hash
export async function findUserByEmail(
  email: string
): Promise<User | null> {
  // Execute a parameterized SQL query to prevent SQL injection
  const result = await pool.query<DBUserRow>(
    `SELECT id, email, role, created_at
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email] // $1 is replaced safely with the supplied email
  );

  // Return the user if found; otherwise, return null
  return result.rows[0] ?? null;
}

// Create a new user in the database
export async function createUser(
  email: string,
  passwordHash: string
): Promise<User> {
  // Insert the email and hashed password into the users table
  const result = await pool.query<DBUserRow>(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     RETURNING id, email, role, created_at`,
    [email, passwordHash] // Never store the plain-text password
  );

  // RETURNING provides the newly created user's selected fields
  return result.rows[0];
}

// Find a user by email, including the password hash for login verification
export async function findUserByEmailWithPassword(
  email: string
): Promise<DBUserWithPasswordRow | null> {

  // Retrieve password_hash so the auth service can verify the password
  const result = await pool.query<DBUserWithPasswordRow>(
    `SELECT id, email, role, password_hash, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );

  // Return the matching user or null if no account exists
  return result.rows[0] ?? null;
}