
import { Router } from "express";

import { healthRouter } from "./health_routes";
import { authRouter } from "./auth_routes";
import { userTaskRouter } from "./user_task_routes";
import { adminTaskRouter } from "./admin_task_routes";
import { adminBannerRouter } from "./admin_banner_routes";

// Create the main API router
export const apiRouter = Router();

// Health check routes
apiRouter.use(healthRouter);

// Authentication routes
apiRouter.use("/auth", authRouter);

// User task routes
apiRouter.use("/tasks", userTaskRouter);

// Admin task routes
apiRouter.use("/admin/tasks", adminTaskRouter);

apiRouter.use("/admin/banners",adminBannerRouter);

