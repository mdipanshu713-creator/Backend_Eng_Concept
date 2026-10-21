
import { Router } from "express";

<<<<<<< HEAD
import { healthRouter } from "./health_routes";
import { authRouter } from "./auth_routes";
import { userTaskRouter } from "./user_task_routes";
import { adminTaskRouter } from "./admin_task_routes";
=======
import {Router} from 'express';
import { healthRouter } from './health_routes';
import { authRouter} from "./auth_routes";
import { userTaskRouter } from './user_task_routes';
>>>>>>> cc85c28 (Implement user task listing and creation)

// Create the main API router.
export const apiRouter = Router();

// Register all application routes.

// Health check routes
apiRouter.use(healthRouter);
<<<<<<< HEAD

// Authentication routes
apiRouter.use("/auth", authRouter);

// User task routes
apiRouter.use("/tasks", userTaskRouter);

// Admin task routes
apiRouter.use("/admin/tasks", adminTaskRouter);
=======
apiRouter.use("/auth",authRouter);
apiRouter.use("/tasks",userTaskRouter);
>>>>>>> cc85c28 (Implement user task listing and creation)
