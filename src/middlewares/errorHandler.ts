import { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger";
import { AppError } from "../errors/AppError";

// Centralized Express error-handling middleware
export function errorHandler(
  err: Error,           // Error object passed by Express
  _req: Request,        // Request object (unused in this middleware)
  res: Response,        // Sends the error response to the client
  _next: NextFunction   // Required for Express to recognize error middleware
): void {

  // Handle expected application errors with their defined status codes
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return; // Stop execution after sending the response
  }

  // Log unexpected errors for debugging and monitoring
  logger.error({ err }, "Unhandled error");

  // Hide internal error details from clients
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}