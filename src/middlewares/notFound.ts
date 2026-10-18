import { Request, Response } from "express";

// Handle requests to undefined routes
export function notFound(_req: Request, res: Response): void {
    res.status(404).json({
        success: false, // Indicates failure
        message: "Route not found", // Error message
    });
}