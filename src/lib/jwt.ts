
import type { TokenPayload } from "../types/user";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

// Generate a signed JWT access token for an authenticated user.
export function signAccessToken(payload: TokenPayload): string {
  // Configure token options, including its expiration time.
  const options: SignOptions = {
    expiresIn: env.jwtAccessExpiresIn as SignOptions["expiresIn"],
    algorithm: "HS256",
  };

  // Sign the payload using the secret key and return the token.
  return jwt.sign(payload, env.jwtAccessSecret, options);
}
