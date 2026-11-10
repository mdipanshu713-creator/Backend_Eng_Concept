
import { AppError } from "../errors/AppError";
import {
    createTask,
    deleteTask,
    fetchTaskByUserId,
    findTaskByIdAndUserId,
    updateTaskTitle,
} from "../repositories/user_task_repository";
import type { Task } from "../types/task";

// Validate and normalize task title
function validateTitle(title: unknown): string {
    if (typeof title !== "string" || !title.trim()) {
        throw new AppError(400, "Title is required");
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle.length > 100) {
        throw new AppError(400, "Title must be 100 characters or less");
    }

    return trimmedTitle;
}

// Create a task
export async function createUserTask(
    userId: string,
    title: unknown
): Promise<Task> {
    const validTitle = validateTitle(title);
    return createTask(userId, validTitle);
}

// Get all tasks for a user
export async function getUserTasks(
    userId: string
): Promise<Task[]> {
    return fetchTaskByUserId(userId);
}

// Get one task belonging to a user
export async function getUserTasksById(
    taskId: string,
    userId: string
): Promise<Task> {
    const task = await findTaskByIdAndUserId(taskId, userId);

    if (!task) {
        throw new AppError(404, "Task not found");
    }

    return task;
}

// Update a task title
export async function updateUserTask(
    taskId: string,
    userId: string,
    title: unknown
): Promise<Task> {
    const validTitle = validateTitle(title);
    const task = await updateTaskTitle(taskId, userId, validTitle);

    if (!task) {
        throw new AppError(404, "Task not found");
    }

    return task;
}

// Delete a task
export async function deleteUserTask(
    taskId: string,
    userId: string
): Promise<void> {
    const deleted = await deleteTask(taskId, userId);

    if (!deleted) {
        throw new AppError(404, "Task not found");
    }
}
