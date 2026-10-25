
import { pool } from "../lib/db";
import { Task } from "../types/task";

// Represents one row returned from the database.
// Here, we assume the database row matches the Task type.
type TaskRow = Task;

// Optional filters that an admin can use to search tasks.
type AdminTaskListFilters = {
    search?: string; // Search by task title
    status?: string; // Filter by task status
};

// Fetch all tasks, optionally filtering by title and status.
export async function findAllTasks(
    filters: AdminTaskListFilters
): Promise<Task[]> {

    // Stores SQL conditions, such as:
    // title ILIKE $1
    // status = $2
    const conditions: string[] = [];

    // Stores the actual values for SQL placeholders.
    const values: unknown[] = [];

    // PostgreSQL placeholders start at $1.
    let paramIndex = 1;

    // 1. Search tasks by title.
    if (filters.search) {
        conditions.push(`title ILIKE $${paramIndex}`);

        // % allows matching text before and after the search term.
        values.push(`%${filters.search}%`);

        // Move to the next placeholder.
        paramIndex++;
    }

    // 2. Filter tasks by status.
    if (filters.status) {
        conditions.push(`status = $${paramIndex}`);

        // Add the status value for its SQL placeholder.
        values.push(filters.status);

        // Increment for any future filters.
        paramIndex++;
    }

    // Create the WHERE clause only when filters exist.
    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

    // Execute the SQL query using parameterized values.
    const result = await pool.query<TaskRow>(
        `
        SELECT
            id,
            title,
            status,
            user_id,
            created_at,
            updated_at
        FROM support_tasks
        ${whereClause}
        ORDER BY created_at DESC
        `,
        values
    );

    // Return the array of task rows.
    return result.rows;
}

export async function updateTaskStatus(
    taskId: string,
    status: string
): Promise<Task | null> {
    const result = await pool.query<TaskRow>(
        `
        UPDATE support_tasks
        SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id, title, status, user_id, created_at, updated_at
        `,
        [status, taskId]
    );

    return result.rows[0] ?? null;
}
