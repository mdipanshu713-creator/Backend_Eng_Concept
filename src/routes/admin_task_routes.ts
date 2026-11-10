
import { Router } from "express";
import { authenticate } from "../middlewares/auth_middleware";
import { requireAdmin } from "../middlewares/admin_middleware";
import {
    getAdminTasks,
    updateAdminTaskStatus,
} from "../services/admin_task_service";

export const adminTaskRouter = Router();

// Require authentication and admin access
adminTaskRouter.use(authenticate, requireAdmin);

// GET /api/admin/tasks?search=login&status=OPEN
adminTaskRouter.get("/", async (req, res, next): Promise<void> => {
    try {
        const search =
            typeof req.query.search === "string"
                ? req.query.search
                : undefined;

        const status =
            typeof req.query.status === "string"
                ? req.query.status
                : undefined;

        const data = await getAdminTasks({ search, status });

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
});

// PATCH /api/admin/tasks/:taskId/status
adminTaskRouter.patch(
    "/:taskId/status",
    async (req, res, next): Promise<void> => {
        try {
            const task = await updateAdminTaskStatus(
                req.params.taskId,
                req.body.status
            );

            res.status(200).json({
                success: true,
                data: { task },
            });
        } catch (error) {
            next(error);
        }
    }
);
