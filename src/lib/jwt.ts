
import type { TokenPayload } from "../types/user";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

// Generate a signed JWT access token for an authenticated user.
export function signAccessToken(payload: TokenPayload): string {
  // Configure JWT options such as subject, expiration, and algorithm.
  const options: SignOptions = {
    // Store the user's ID in the standard JWT "sub" claim.
    // The authentication middleware reads payload.sub to identify the user.
    subject: payload.userId,

    // Set how long the access token remains valid.
    // The value comes from environment configuration.
    expiresIn: env.jwtAccessExpiresIn as SignOptions["expiresIn"],

    // Restrict token signing to the HS256 algorithm.
    algorithm: "HS256",
  };

  // Sign the token with the configured secret.
  // Include email and role as custom claims in the JWT payload.
  // The subject and expiration-related claims are added by jsonwebtoken.
  return jwt.sign(
    {
      email: payload.email,
      role: payload.role,
    },
    env.jwtAccessSecret,
    options
  );
}


// 12.10