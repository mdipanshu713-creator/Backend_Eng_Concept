<<<<<<< HEAD

import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

// Check whether the authenticated user has admin privileges.
export function requireAdmin(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    // authenticate middleware should set req.user first.
    if (!req.user) {
        next(new AppError(401, "Authentication required"));
        return;
    }

    // Allow only users with the ADMIN role.
    if (req.user.role !== "ADMIN") {
        next(new AppError(403, "Admin access required"));
        return;
    }

    // User is authenticated and is an admin.
=======
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";


export function requireAdmin (
    req:Request,
    _res:Response,
    next:NextFunction
):void {
    if(req.user?.role !== 'ADMIN') {
        next(new AppError(403,"Admin access required .You do not have admin access it seems"))
        return;
    }
>>>>>>> cc85c28 (Implement user task listing and creation)
    next();
}
