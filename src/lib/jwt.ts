
import type { TokenPayload } from "../types/user";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";

// Generate a signed JWT access token
export function signAccessToken(payload: TokenPayload): string {
  const options: SignOptions = {
    subject: payload.userId,
    expiresIn: env.jwtAccessExpiresIn as SignOptions["expiresIn"],
    algorithm: "HS256",
  };

  return jwt.sign(
    {
      email: payload.email,
      role: payload.role,
    },
    env.jwtAccessSecret,
    options
  );
}

// Verify the token and return its payload
export function verifyAccessToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, env.jwtAccessSecret, {
      algorithms: ["HS256"],
    });

    if (
      typeof decoded === "string" ||
      typeof decoded.sub !== "string" ||
      typeof decoded.email !== "string" ||
      typeof decoded.role !== "string"
    ) {
      throw new Error("Invalid token payload");
    }

    return {
      userId: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    throw new AppError(401, "Invalid or expired access token");
  }
}
