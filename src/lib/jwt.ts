import type { TokenPayload } from "../types/user";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";

// Generate a signed JWT access token
export function signAccessToken(payload: TokenPayload): string {
<<<<<<< HEAD
  // Configure JWT options such as subject, expiration, and algorithm.
=======
>>>>>>> cc85c28 (Implement user task listing and creation)
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

<<<<<<< HEAD
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
=======
  return jwt.sign(payload, env.jwtAccessSecret, options);
}

// Verify the token and return its payload
export function verifyAccessToken(token: string): TokenPayload {
  try {
    // Verify signature, expiration, and permitted algorithm
    const decoded = jwt.verify(token, env.jwtAccessSecret, {
      algorithms: ["HS256"],
    });

    // Ensure the token contains the expected user information
    if (
      typeof decoded === "string" ||
      typeof decoded.userId !== "string" ||
      typeof decoded.email !== "string" ||
      typeof decoded.role !== "string"
    ) {
      throw new Error("Invalid token payload");
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    throw new AppError(401, "Invalid or expired access token");
  }
}

// 11.48
>>>>>>> cc85c28 (Implement user task listing and creation)
