
import { Router } from "express";
import { authenticate } from "../middlewares/auth_middleware";
import {
    createUserTask,
    deleteUserTask,
    getUserTasks,
    getUserTasksById,
    updateUserTask,
} from "../services/user_task_service";

export const userTaskRouter = Router();

// Protect all task routes
userTaskRouter.use(authenticate);

// POST / — Create a task
userTaskRouter.post("/", async (req, res, next): Promise<void> => {
    try {
        const task = await createUserTask(
            req.user!.userId,
            req.body.title
        );

        res.status(201).json({
            success: true,
            data: { task },
        });
    } catch (error) {
        next(error);
    }
});

// GET / — List the user's tasks
userTaskRouter.get("/", async (req, res, next): Promise<void> => {
    try {
        const tasks = await getUserTasks(req.user!.userId);

        res.status(200).json({
            success: true,
            data: { tasks },
        });
    } catch (error) {
        next(error);
    }
});

// GET /:taskId — Get one task
userTaskRouter.get("/:taskId", async (req, res, next): Promise<void> => {
    try {
        const task = await getUserTasksById(
            req.params.taskId,
            req.user!.userId
        );

        res.status(200).json({
            success: true,
            data: { task },
        });
    } catch (error) {
        next(error);
    }
});

// PATCH /:taskId — Update a task
userTaskRouter.patch("/:taskId", async (req, res, next): Promise<void> => {
    try {
        const task = await updateUserTask(
            req.params.taskId,
            req.user!.userId,
            req.body.title
        );

        res.status(200).json({
            success: true,
            data: { task },
        });
    } catch (error) {
        next(error);
    }
});

// DELETE /:taskId — Delete a task
userTaskRouter.delete("/:taskId", async (req, res, next): Promise<void> => {
    try {
        await deleteUserTask(
            req.params.taskId,
            req.user!.userId
        );

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        next(error);
    }
});
