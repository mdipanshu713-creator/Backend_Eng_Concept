import path from "node:path";
import fs from "node:fs";
import { pool } from "../lib/db.js";
import { logger } from "../lib/logger.js";

// Get the migrations directory path
const MIGRATIONS_DIR = path.join(process.cwd(), "migrations");

// Create a table to track executed migrations
const CREATE_MIGRATIONS_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
`;

// Define the structure of a migration record
type MigrationsRow = {
    name: string;
};

// Get migration names already executed
async function getExecutedMigrations(): Promise<string[]> {
    const result = await pool.query<MigrationsRow>(
        "SELECT name FROM migrations ORDER BY name"
    );

    return result.rows.map((row) => row.name);
}

// Read and sort all SQL migration files
function getMigrationsFiles(): string[] {
    return fs
        .readdirSync(MIGRATIONS_DIR)
        .filter((file) => file.endsWith(".sql"))
        .sort();
}

// Execute one migration inside a transaction
async function runMigration(fileName: string): Promise<void> {
    // Read SQL commands from the migration file
    const sql = fs.readFileSync(
        path.join(MIGRATIONS_DIR, fileName),
        "utf-8"
    );

    // Get a dedicated database connection
    const client = await pool.connect();

    try {
        // Start the transaction
        await client.query("BEGIN");

        // Execute migration SQL
        await client.query(sql);

        // Record the executed migration
        await client.query(
            "INSERT INTO migrations (name) VALUES ($1)",
            [fileName]
        );

        // Save the transaction changes
        await client.query("COMMIT");

        logger.info(`Migration completed: ${fileName}`);
    } catch (err) {
        // Undo changes if the migration fails
        await client.query("ROLLBACK");
        throw err;
    } finally {
        // Return the connection to the pool
        client.release();
    }
}

// Main migration function
async function migrate(): Promise<void> {
    // Create the tracking table if it does not exist
    await pool.query(CREATE_MIGRATIONS_TABLE_SQL);

    // Store executed migration names in a Set
    const executed = new Set(await getExecutedMigrations());

    // Find migrations that have not been executed
    const pending = getMigrationsFiles().filter(
        (file) => !executed.has(file)
    );

    // Stop if no migrations are pending
    if (pending.length === 0) {
        logger.info("No pending migrations");
        return;
    }

    // Execute pending migrations one by one
    for (const fileName of pending) {
        await runMigration(fileName);
    }

    logger.info("All migrations completed");
}

// Run migrations and handle errors
migrate()
    .catch((err: unknown) => {
        logger.error({ err }, "Migrations failed");
        process.exitCode = 1;
    })
    .finally(async () => {
        // Close the database connection pool
        await pool.end();
    });