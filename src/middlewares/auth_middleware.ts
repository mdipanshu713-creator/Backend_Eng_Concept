
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { env } from "../config/env";
import type { TokenPayload } from "../types/user";

// Verify the JWT before allowing access to protected routes.
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  // Read the Authorization header from the incoming request.
  const authHeader = req.headers.authorization;

  // Check whether the header uses the Bearer authentication scheme.
  if (!authHeader?.startsWith("Bearer ")) {
    next(new AppError(401, "Access token is required"));
    return;
  }

  // Extract the JWT by removing the "Bearer " prefix.
  const token = authHeader.slice(7);

  try {
    // Verify the signature, expiration, and allowed algorithm.
    const payload = jwt.verify(token, env.jwtAccessSecret, {
      algorithms: ["HS256"],
    });

    // Ensure the verified payload contains a subject.
    if (typeof payload === "string" || !payload.sub) {
      next(new AppError(401, "Invalid access token"));
      return;
    }

    // Attach verified user information to the Express request.
    req.user = {
      userId: payload.sub,
      email: typeof payload.email === "string" ? payload.email : "",
      role: typeof payload.role === "string" ? payload.role : "",
    } satisfies TokenPayload;

    // Continue to the next middleware or protected route.
    next();
  } catch {
    // Forward token verification errors to the error handler.
    next(new AppError(401, "Invalid or expired access token"));
  }
}
