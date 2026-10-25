
import { AppError } from "../errors/AppError";
import { findAllTasks, updateTaskStatus } from "../repositories/admin_task_repository";
import { Task } from "../types/task";

// Example: GET /api/admin/tasks?search=login&status=OPEN

// Query parameters received from the request.
type AdminTasklistQuery = {
    search?: string;
    status?: string;
};

// Structure of the response returned by this service.
type AdminTaskListResponse = {
    tasks: Task[];
};

// Allowed task statuses.
const TASK_STATUSES = [
    "OPEN",
    "IN_PROGRESS",
    "RESOLVED"
] as const;

type TaskStatus = (typeof TASK_STATUSES)[number];

export async function getAdminTasks(
    query: AdminTasklistQuery
): Promise<AdminTaskListResponse> {

    // Remove leading and trailing spaces from the search term.
    const search = query.search?.trim() || undefined;

    // Read status from query.status, not query.search.
    const status = query.status?.trim() || undefined;

    // Validate the supplied status.
    if (
        status &&
        !TASK_STATUSES.includes(status as TaskStatus)
    ) {
        throw new AppError(
            400,
            "status must be OPEN, IN_PROGRESS, or RESOLVED"
        );
    }

    // Fetch tasks from the repository using the filters.
    const tasks = await findAllTasks({
        search,
        status
    });

    // Return the response in the expected format.
    return {
        tasks
    };
}


export async function updateAdminTaskStatus(
    taskId:string,
    status:unknown
):Promise<Task>{
    if (typeof status !== 'string' ||  !TASK_STATUSES.includes(status as TaskStatus)){
        throw new AppError(
    400,
    "status must be between open,inprogress or resolved"
);
    }
    const task = await updateTaskStatus(taskId,status)

    if(!task) {
        throw new AppError(404,"Task not found")
    }
    return task
}
