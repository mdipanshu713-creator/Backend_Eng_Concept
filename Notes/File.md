# Notes: Why We Use `app.ts` in Node.js

## 1. What is `app.ts`?

`app.ts` is the file where we create and configure our Express.js application. It defines how the application handles incoming requests by registering middleware, routes, and error handlers.

In our capstone project, `app.ts` acts as the central place for Express application configuration.

## 2. Why do we use `app.ts`?

1. Create the Express application using `express()`.
2. Configure middleware such as CORS and JSON body parsing.
3. Register API routes for authentication, users, health checks, and other features.
4. Handle invalid routes using 404 middleware.
5. Handle errors centrally using error-handling middleware.
6. Separate responsibilities so application configuration stays independent of server startup.
7. Make testing easier because we can test the Express app without starting a network server.

## 3. Code from our project

```
import express from "express";
import cors from "cors";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { apiRouter } from "./routes/index.js";

export function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/api", apiRouter);

    app.use(notFound);
    app.use(errorHandler);

    return app;
}
```

## 4. Understand each line

| Code                               | Purpose                                            |
| ---------------------------------- | -------------------------------------------------- |
| `express()`                        | Creates an Express application instance.           |
| `app.use(cors())`                  | Configures cross-origin request handling.          |
| `app.use(express.json())`          | Parses incoming JSON request bodies.               |
| `app.use(express.urlencoded(...))` | Parses URL-encoded form submissions.               |
| `app.use("/api", apiRouter)`       | Mounts API routes under `/api`.                    |
| `app.use(notFound)`                | Handles requests that match no registered route.   |
| `app.use(errorHandler)`            | Processes errors passed to Express error handling. |
| `return app`                       | Returns the configured application to the caller.  |

Important: Middleware order matters. Routes are registered before the 404 handler, and the error handler comes afterward so errors forwarded by earlier middleware or routes can reach it.

## 5. Why do we separate `app.ts` and `server.ts`?

`app.ts` — Configuration

Creates Express, registers middleware and routes, and returns the configured app.

`server.ts` — Startup

Imports `createApp()`, selects a port, and calls `app.listen()` to start accepting connections.

This design follows the separation of concerns principle. It makes the codebase easier to maintain, test, and extend.

## 6. Interview answer

Question: Why do we use `app.ts` in a Node.js application?

Answer:

“We use `app.ts` to create and configure our Express application. It manages middleware, API routes, and error-handling logic. We separate it from `server.ts` to follow the separation of concerns principle. This makes the application easier to test and maintain because we can test the Express app without starting the HTTP server.”

## 7. Quick revision

- `app.ts` → Creates and configures Express.
- `server.ts` → Starts the server.
- `app.use()` → Registers middleware.
- `app.use("/api", apiRouter)` → Mounts API routes.
- `notFound` → Handles unmatched routes.
- `errorHandler` → Handles forwarded application errors.
- `createApp()` → Returns the configured Express app.

Remember: `app.ts` defines how the application behaves; `server.ts` makes it available to incoming network requests.