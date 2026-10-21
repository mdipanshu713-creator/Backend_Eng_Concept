import { AppError } from "../errors/AppError";
<<<<<<< HEAD
import {
  createTask,
  deleteTask,
  fetchTaskByUserId,
  findTaskByIdAndUserId,
  updateTaskTitle,
} from "../repositories/user_task_repository";
import { Task } from "../types/task";

// Validate the title and remove unnecessary whitespace.
function validateTitle(title: unknown): string {
  if (typeof title !== "string" || !title.trim()) {
    throw new AppError(400, "Title is required");
  }

  const trimmedTitle = title.trim();

  if (trimmedTitle.length > 100) {
    throw new AppError(400, "Title must be 100 char or less");
  }

  return trimmedTitle;
}

// Create a task for the authenticated user.
export async function createUserTask(
  userId: string,
  title: unknown
): Promise<Task> {
  const validTitle = validateTitle(title);
  return createTask(userId, validTitle);
}

// Fetch all tasks belonging to the user.
export async function getUserTasks(
  userId: string
): Promise<Task[]> {
  return fetchTaskByUserId(userId);
}

// Fetch one task only if it belongs to the user.
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

// Update a task title only if it belongs to the user.
export async function updateUserTask(
  taskId: string,
  userId: string,
  title: unknown
): Promise<Task> {
  const validTitle = validateTitle(title);

  // Wait for the database update to finish.
  const task = await updateTaskTitle(taskId, userId, validTitle);

  // Return 404 if the task doesn't exist or isn't owned by the user.
  if (!task) {
    throw new AppError(404, "Task not found");
  }

  return task;
}


export async function deleteUserTask(
  taskId:string,
  userId:string
):Promise<void> {
  const deleted  =  await deleteTask(taskId,userId)

  if(!deleted){
    throw new AppError(404,"Task not found")
  }
=======
import { createTask } from "../repositories/user_task_repository";
import { Task } from "../types/task";



function validateTitle(title:unknown):string {
    if(typeof title != 'string' || !title.trim()){
        throw new AppError(400,"Title is required")
    }
    const trimmedTitle = title.trim()

    if(trimmedTitle.length > 100) {
        throw new AppError(400,'Title must be 100 char or less')
    }
    return trimmedTitle
}

export async function createUserTask(userId:string,title:unknown):Promise<Task> {

    const validTitle = validateTitle(title)
    return  createTask(userId,validTitle)
>>>>>>> cc85c28 (Implement user task listing and creation)
}