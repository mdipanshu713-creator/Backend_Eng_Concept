# Connection Pool in PostgreSQL and Node.js

A connection pool is a collection of reusable database connections that an application keeps ready so it doesn't need to create a new connection for every database request.

## 1. Real-life example

Imagine a college with 1,000 students who need to access a database.

- Without a connection pool: Every student request creates a new database connection and closes it afterward.
- With a connection pool: The application maintains, for example, 10 reusable connections. Requests use an available connection and return it to the pool when finished.

Multiple API requests

Request 1 · Request 2 · Request 3 · ...

Connection Pool

Maintains 10 reusable connections

C1

C2

C3

C4

C5

PostgreSQL Database

When a query finishes, the connection returns to the pool for another request to use.

## 2. Why do we need a connection pool?

- Performance: Avoids repeatedly creating database connections.
- Resource management: Limits how many connections your application opens.
- Scalability: Helps handle multiple simultaneous API requests.
- Reliability: Prevents your application from opening too many database connections.

## 3. Connection pool in Node.js with PostgreSQL

Install the PostgreSQL driver:

```
npm install pg
npm install -D @types/pg
```

Create a file named `db.ts`:

```
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
```

Example `.env`:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/mydb
```

Use the pool to execute a query:

```
import { pool } from "./db";

async function getUsers() {
    const result = await pool.query(
        "SELECT * FROM users"
    );

    return result.rows;
}
```

### What do these settings mean?

| Setting                         | Meaning                                                           |
| ------------------------------- | ----------------------------------------------------------------- |
| `max: 10`                       | Allow up to 10 connections in this pool                           |
| `idleTimeoutMillis: 30000`      | Close idle connections after 30 seconds, subject to pool behavior |
| `connectionTimeoutMillis: 2000` | Wait up to 2 seconds to establish a connection before timing out  |
| `connectionString`              | Database connection details                                       |

## 4. `pool.query()` vs `pool.connect()`

`pool.query()` is best for ordinary, single queries. The pool handles checking out and releasing a connection automatically.

`pool.connect()` is useful when multiple queries must run on the same connection, such as a database transaction.

Example transaction:

```
const client = await pool.connect();

try {
    await client.query("BEGIN");

    await client.query(
        "UPDATE accounts SET balance = balance - 500 WHERE id = 1"
    );

    await client.query(
        "UPDATE accounts SET balance = balance + 500 WHERE id = 2"
    );

    await client.query("COMMIT");
} catch (error) {
    await client.query("ROLLBACK");
    throw error;
} finally {
    client.release();
}
```

The `finally` block ensures the connection is returned to the pool even if a query fails.

Important: Never forget `client.release()` when you use `pool.connect()`. Otherwise, connections can remain checked out, and future requests may get stuck waiting for an available connection.

## 5. Interview answer

> A connection pool is a mechanism that maintains reusable database connections. Instead of establishing a new connection for every request, the application reuses existing connections, improving performance, managing database resources, and supporting concurrent requests.

Remember: A connection pool does not mean that every request gets its own permanent connection. Connections are shared and reused as requests need them.