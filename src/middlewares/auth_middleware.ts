import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { verifyAccessToken } from "../lib/jwt";

// Authenticate requests using a JWT access token
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  // Read the Authorization header
  const authHeader = req.headers.authorization;

  // Reject requests without a Bearer token
  if (!authHeader?.startsWith("Bearer ")) {
    next(new AppError(401, "Access token is required"));
    return;
  }

  // Extract the token after "Bearer "
  const token = authHeader.slice(7);

  try {
    // Verify the token and retrieve its payload
    req.user = verifyAccessToken(token);

    // Continue to the protected route
    next();
  } catch {
    // Forward token verification errors to the error handler
    next(new AppError(401, "Invalid or expired access token"));
  }
}