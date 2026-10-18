# Pino Logging in Node.js + Express

## 1. What Is Pino?

Pino is a fast, low-overhead structured logging library for Node.js.

It records HTTP requests, errors, warnings, and application events so developers can understand and troubleshoot backend behavior.

**Simple meaning:** Pino helps us track what our backend is doing while it runs.

## 2. Why Do We Need Pino?

Suppose a user tries to log in, but the API fails.

Without useful logs, identifying the cause can be difficult. With Pino, we can record relevant events and error details to help investigate the failure.

## 3. Common Logging Levels

| Level | Purpose |
|---|---|
| `trace` | Very detailed diagnostics |
| `debug` | Development and debugging information |
| `info` | Normal application events |
| `warn` | Unexpected situations |
| `error` | Errors and failed operations |
| `fatal` | Critical failures |

The default `info` level filters out `trace` and `debug` messages.

## 4. Install Pino

```powershell
npm install pino pino-http
```

- `pino`: Creates the application logger.
- `pino-http`: Adds HTTP request logging middleware for Express.

## 5. Create `src/lib/logger.ts`

```typescript
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
});

export default logger;
```

### Explanation

- `pino`: Imports the logging library.
- `level`: Sets the minimum logging severity.
- `process.env.LOG_LEVEL`: Reads the configured logging level.
- `|| "info"`: Uses `info` when the configured value is falsy.
- `export default logger`: Makes the logger reusable across files.

## 6. Add HTTP Logging in `src/app.ts`

```typescript
import express from "express";
import pinoHttp from "pino-http";
import logger from "./lib/logger";

const app = express();

app.use(pinoHttp({ logger }));
app.use(express.json());

app.get("/", (req, res) => {
  req.log.info("Home route accessed");

  res.json({
    message: "Hello World",
  });
});

export default app;
```

### What Does `pinoHttp()` Do?

It integrates Pino with Express to log HTTP requests and responses.

For example, when a client requests `/`, the middleware records useful information about the request and its outcome.

`req.log.info()` writes a message using the logger associated with that request.

## 7. Use the Logger in `src/server.ts`

```typescript
import app from "./app";
import { env } from "./config/env";
import logger from "./lib/logger";

app.listen(env.port, () => {
  logger.info(`Server started on port ${env.port}`);
});
```

This keeps application configuration in `app.ts` and server startup in `server.ts`.

## 8. What Does Pino Output Look Like?

Example:

```json
{
  "level": 30,
  "time": 1791720000000,
  "msg": "Home route accessed"
}
```

- `level: 30` represents `info`.
- `time` represents the log timestamp.
- `msg` contains the log message.

Pino outputs structured JSON by default, which is useful for log collection and searching.

## 9. Pino vs. `console.log()`

| `console.log()` | Pino |
|---|---|
| Basic output | Structured logging |
| No built-in severity levels | Multiple log levels |
| Manual formatting | JSON output by default |
| Limited logging features | Serializers, child loggers, and redaction |
| Useful for quick debugging | Better suited to structured application logging |

## 10. Important Production Practices

- Use appropriate logging levels.
- Log useful error details without exposing internal secrets.
- Add request IDs to trace individual requests across services.
- Redact passwords, access tokens, and other sensitive fields.
- Avoid logging sensitive request bodies.
- Configure log collection and retention when needed.

**Note:** Pino does not automatically fix errors or provide complete infrastructure monitoring.

## 11. Interview Answer

Pino is a fast, structured logging library for Node.js. I use it instead of relying only on `console.log()` because it supports severity levels, JSON-formatted logs, serializers, and redaction. With `pino-http`, I can also log HTTP requests in an Express application, making debugging and production troubleshooting easier.

## 12. Quick Revision

- **Pino:** Structured logging library.
- **pino-http:** HTTP request logging middleware.
- **`logger.info()`:** Records normal events.
- **`logger.error()`:** Records errors.
- **`req.log`:** Request-associated logger provided by `pino-http`.
- **JSON logs:** Structured output suitable for log analysis.
- **Redaction:** Prevents configured sensitive fields from appearing in logs.
