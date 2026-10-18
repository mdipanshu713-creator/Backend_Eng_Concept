

# 1. What is a Connection Pool?

A connection pool is a collection of reusable database connections maintained by your application.

Instead of creating a new PostgreSQL connection for every request, the application reuses existing connections.

Node.js / Express.js Server

Incoming API requests

Connection Pool (`pg.Pool`)

Manages and reuses connections

Connection 1

Connection 2

Connection 3

PostgreSQL Database

### Interview answer

"A connection pool manages a set of reusable database connections. It improves performance by avoiding the overhead of repeatedly creating and closing connections. It also limits concurrent connections to help protect the database from overload."

# 2. Explain your code line by line

```
import { Pool } from "pg";
import dotenv from "dotenv";

const envResult = dotenv.config();

console.log("Loaded .env path:", envResult?.parsed ? "Found" : "Not found");
console.log("DATABASE_URL exists:", Boolean(process.env.DATABASE_URL));

if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);

    console.log("DB username:", url.username);
    console.log("DB host:", url.hostname);
    console.log("DB port:", url.port);
    console.log("DB name:", url.pathname);
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
});
```

| Code                                | Interview explanation                                                   |
| ----------------------------------- | ----------------------------------------------------------------------- |
| `import { Pool } from "pg"`         | Imports PostgreSQL connection-pool functionality from the `pg` package. |
| `dotenv.config()`                   | Loads environment variables from `.env` into `process.env`.             |
| `Boolean(process.env.DATABASE_URL)` | Checks whether the database URL exists.                                 |
| `new URL(...)`                      | Parses the connection URL to inspect its components.                    |
| `new Pool({...})`                   | Creates a pool to manage reusable connections.                          |
| `connectionString`                  | Supplies PostgreSQL connection details.                                 |
| `max: 10`                           | Allows up to 10 client connections in this pool.                        |
| `export const pool`                 | Makes the pool available to other modules.                              |

Important: `max: 10` does not mean the pool immediately opens 10 connections. Connections are generally created on demand, up to the configured limit.

# 3. Most frequently asked interview questions

QUESTION 1 · FUNDAMENTALS

What is connection pooling, and why is it needed?

Sample answer

Connection pooling reuses database connections instead of opening a new connection for every request. It reduces connection setup overhead, improves efficiency, and controls the number of simultaneous database connections.

QUESTION 2 · CODE

What does `max: 10` mean?

It sets the maximum number of clients that this particular pool can hold at one time. If all connections are busy, additional queries may wait in the pool's queue until a client becomes available.

QUESTION 3 · COMPARISON

What is the difference between `Pool` and `Client`?

- `Client`: Represents an individual PostgreSQL connection.
- `Pool`: Manages multiple clients and lends them to application code as needed.

For a typical API server handling multiple requests, a pool is usually the better choice.

QUESTION 4 · PERFORMANCE

What happens when all 10 connections are busy?

New operations requesting a connection generally wait in the pool queue until a connection becomes available. If waiting exceeds a configured acquisition timeout, the operation can fail.

QUESTION 5 · PRACTICAL

How do you execute a query using your pool?

```
const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [userId]
);

console.log(result.rows);
```

`pool.query()` acquires a connection, executes the query, and releases the connection back to the pool automatically when the operation completes.

QUESTION 6 · ERROR HANDLING

Why should we listen for pool errors?

An idle pooled connection can encounter an unexpected error, such as a network failure. An error listener helps the application observe these errors.

```
pool.on("error", (err) => {
    console.error("Unexpected idle client error:", err);
});
```

QUESTION 7 · RESOURCE MANAGEMENT

Why should we call `pool.end()`?

It closes the pool and its connections. This is useful during graceful application shutdown, not after every API request.

QUESTION 8 · SECURITY

Is it safe to log `DATABASE_URL`?

No. It can contain database credentials. Your current code avoids printing the complete URL, which is good. Also avoid logging passwords, tokens, or other secrets.

# 4. Tricky questions interviewers may ask

| Interview question                                      | Key point                                                                        |
| ------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Does a pool create 10 connections immediately?          | No, generally on demand.                                                         |
| Can two queries use the same connection simultaneously? | Not as independent concurrent operations on the same PostgreSQL client.          |
| Should we create a new pool inside every API request?   | No. Usually create one shared pool per application process.                      |
| Is `pool.query()` enough for transactions?              | No. Use one checked-out client for the entire transaction.                       |
| Can multiple server instances each have `max: 10`?      | Yes. Their combined connections can exceed the database's capacity.              |
| What happens if a checked-out client is never released? | Connections can be exhausted, causing requests to wait indefinitely or time out. |

## 5. Important: Transactions require a single client

For ordinary queries, `pool.query()` is convenient. For transactions, acquire one client and use it for every statement.

```
const client = await pool.connect();

try {
    await client.query("BEGIN");

    await client.query(
        "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
        [100, 1]
    );

    await client.query(
        "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
        [100, 2]
    );

    await client.query("COMMIT");
} catch (error) {
    await client.query("ROLLBACK");
    throw error;
} finally {
    client.release();
}
```

Why? PostgreSQL transactions belong to a particular connection. Using separate `pool.query()` calls could execute transaction statements on different connections.

# 6. Improve your current implementation

Your current code is useful for debugging `.env` configuration. For production code, validate the connection string explicitly and keep debugging logs out of routine startup.

```
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing");
}

export const pool = new Pool({
    connectionString: databaseUrl,
    max: 10,
});

pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL pool error:", err.message);
});
```

The pool size of 10 is a starting point, not a universal best setting. Choose it based on database capacity, application concurrency, and the number of running application instances.

# 7. Test your interview knowledge

Let's practise as if you're in a real Node.js backend interview.

1\. Why do we use a connection pool?

To create a new database for each request

To reuse connections and reduce connection overhead

To encrypt every SQL query

To replace PostgreSQL

2\. What does \`max: 10\` mean in your code?

Exactly 10 connections are created immediately

The pool can hold at most 10 client connections

Only 10 SQL queries can ever run

The database can have only 10 users

3\. What must you do after \`await pool.connect()\`?

Always call \`pool.end()\`

Release the checked-out client in a finally block

Create another pool

Restart PostgreSQL

4\. Which approach is correct for a multi-query transaction?

Use pool.query() separately for every statement

Use the same checked-out client for BEGIN, statements, and COMMIT/ROLLBACK

Create a new pool for each statement

Use only console.log()

My recommendation: Be ready to explain the concept, trace what happens when 10 connections are busy, write a safe transaction, and explain why the pool is shared across requests. Those demonstrate practical backend understanding beyond memorizing definitions.