# Pino Logger in Node.js + TypeScript

## 1. What Is a Logger?

A logger records application events, warnings, and errors.

Instead of using `console.log()` everywhere, we configure a reusable logger using **Pino**, a fast structured logging library for Node.js.

## 2. Install Pino

```powershell
npm install pino
```

## 3. Create `src/lib/logger.ts`

```typescript
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
});

export default logger;
```

## 4. Explanation

- `import pino from "pino"` — imports the Pino logging library.
- `level` — sets the minimum severity of messages to display.
- `process.env.LOG_LEVEL` — reads the logging level from an environment variable.
- `|| "info"` — uses `"info"` if the environment variable is empty or falsy.
- `export default logger` — allows other files to import the configured logger.

Example `.env`:

```env
LOG_LEVEL=debug
```

Note: The `.env` file must be loaded before the logger reads the environment variable. If using `dotenv`, load it early in your application startup.

## 5. Use the Logger

In `src/server.ts`:

```typescript
import logger from "./lib/logger";

logger.info("Application started");
logger.warn("This is a warning");
logger.error("Something went wrong");
```

Run the application using your configured development script:

```powershell
npm run dev
```

Pino outputs structured JSON logs by default, making them useful for log collection and monitoring systems.

Example output:

```json
{
  "level": 30,
  "time": 1791720000000,
  "msg": "Application started"
}
```

The timestamp and other fields are generated automatically. Exact output can vary.

## 6. Common Pino Logging Methods

| Method | Purpose |
|---|---|
| `logger.trace()` | Very detailed diagnostics |
| `logger.debug()` | Debugging information |
| `logger.info()` | Normal application events |
| `logger.warn()` | Unexpected situations |
| `logger.error()` | Errors and failures |
| `logger.fatal()` | Critical failures |

With the default `"info"` level, `trace` and `debug` messages are filtered out.

## 7. Why Use a Separate `logger.ts`?

- Reuses one logging configuration throughout the application.
- Keeps logging consistent across routes, controllers, and services.
- Produces structured logs that are easier to search and analyze.
- Makes it easier to change logging levels across environments.

## 8. Production Best Practices

- Never log passwords, API keys, authentication tokens, or sensitive user information.
- Use appropriate log levels for development and production.
- Consider Pino redaction for sensitive fields.
- Include useful contextual information when recording errors.
- Avoid logging the same error repeatedly at multiple layers without adding useful context.

## 9. Interview Answer

Pino is a fast structured logging library for Node.js. We create a reusable logger in a separate `logger.ts` file to centralize logging configuration and use methods such as `info()`, `warn()`, and `error()` throughout the application.

## 10. Quick Revision

- **Pino:** Structured logging library.
- **Logger:** Records application events.
- **Log level:** Determines which messages are recorded.
- **`logger.info()`:** Records normal events.
- **`logger.error()`:** Records errors.
- **Centralized logger:** Maintains consistent logging across the application.
- **Security:** Never expose secrets in logs.
