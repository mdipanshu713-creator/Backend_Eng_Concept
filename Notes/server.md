# Server in Node.js + Express + TypeScript

## 1. What Is a Server?

A server is a program that listens for incoming requests from clients and sends back responses.

In an Express application, the server accepts HTTP requests from clients such as browsers, React applications, and Postman.

**Simple meaning:** A server listens for requests and sends responses.

## 2. What Is `server.ts`?

`server.ts` is the entry point responsible for starting the HTTP server and listening on a specific port.

It typically imports the configured Express application and starts listening for requests.

## 3. Example Project Structure

```text
03_Capstone_Project/
├── src/
│   ├── config/
│   │   └── env.ts
│   ├── lib/
│   │   └── logger.ts
│   ├── middlewares/
│   ├── routes/
│   ├── app.ts
│   └── server.ts
├── .env
├── package.json
└── tsconfig.json
```

## 4. Create `src/server.ts`

```typescript
import app from "./app";
import { env } from "./config/env";
import logger from "./lib/logger";

const server = app.listen(env.port, () => {
  logger.info(`Server running on port ${env.port}`);
});
```

## 5. Explanation

- `import app from "./app"` — Imports the configured Express application.
- `import { env } from "./config/env"` — Imports centralized environment configuration.
- `import logger from "./lib/logger"` — Imports the reusable Pino logger.
- `app.listen()` — Starts the HTTP server and listens on the specified port.
- `env.port` — Provides the configured port number.
- `logger.info()` — Records a message when the server starts listening.
- `server` — Holds the HTTP server instance returned by `app.listen()`.

## 6. What Is a Port?

A port identifies a communication endpoint on a machine.

For example:

```text
http://localhost:4000
```

- `http://` — Protocol.
- `localhost` — Your local machine.
- `4000` — Port number.

If your application listens on port `4000`, clients can send HTTP requests to that port.

## 7. What Happens When the Server Starts?

1. Node.js executes `server.ts`.
2. The Express application is imported from `app.ts`.
3. Configuration is loaded from `env.ts`.
4. `app.listen()` starts accepting HTTP connections.
5. Pino logs a startup message.
6. The server waits for incoming requests.

## 8. Difference Between `app.ts` and `server.ts`

| `app.ts` | `server.ts` |
|---|---|
| Creates and configures the Express app | Starts the HTTP server |
| Registers middleware | Calls `app.listen()` |
| Mounts routes | Defines the listening port through configuration |
| Configures error handling | Can manage server lifecycle and shutdown |

**Remember:** `app.ts` defines application behavior; `server.ts` starts the server.

## 9. How to Run the Server

Configure this script in `package.json`:

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts"
  }
}
```

Start the application:

```powershell
npm run dev
```

Example output:

```text
Server running on port 4000
```

The exact output depends on your configured port and logger.

## 10. Graceful Shutdown

A production server should close its HTTP connections cleanly when it receives a shutdown signal.

Example:

```typescript
process.on("SIGTERM", () => {
  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
});
```

This is a basic illustration. A production application should also handle other relevant shutdown signals and close resources such as database connections. Avoid forcing process termination before pending work has completed.

## 11. Important Points

- `app.listen()` starts the HTTP server.
- A port determines where the server listens for connections.
- `server.ts` is commonly the application entry point.
- `app.ts` configures Express middleware and routes.
- `env.ts` centralizes environment variables.
- Pino records startup messages and other application events.
- `tsx watch` automatically reruns the application when source files change.

## 12. Interview Answer

In an Express application, `server.ts` is typically the entry point that starts the HTTP server. It imports the configured Express application and calls `app.listen()` on a specified port. We keep server startup separate from application configuration to improve code organization and testability.

## 13. Quick Revision

- **Server:** Accepts requests and sends responses.
- **`app.ts`:** Configures the Express application.
- **`server.ts`:** Starts the HTTP server.
- **`app.listen()`:** Starts listening on a port.
- **Port:** Communication endpoint for incoming connections.
- **Pino:** Logs server startup and application events.
- **Graceful shutdown:** Closes the server and resources cleanly.
