## Express.js Middleware — Interview Notes

### 1. What is middleware?

Interview answer:

Middleware is a function in Express.js that executes during the request-response cycle. It can access the request and response objects, execute code, modify the request or response, end the request-response cycle, or pass control to the next middleware using `next()`.

### 2. Syntax

```
import { Request, Response, NextFunction } from "express";

// Basic middleware
function myMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.log("Middleware executed");
    next();
}
```

### 3. How does middleware work?

Client Request

Middleware 1: Logging

Middleware 2: Authentication

Route Handler

HTTP Response

### 4. Types of middleware

| Type              | Example                   | Purpose                               |
| ----------------- | ------------------------- | ------------------------------------- |
| Built-in          | `express.json()`          | Parses JSON request bodies            |
| Application-level | `app.use()`               | Runs middleware across an application |
| Router-level      | `router.use()`            | Runs middleware for a router          |
| Third-party       | `pino-http`               | Logs HTTP requests                    |
| Error-handling    | `(err, req, res, next)`   | Handles errors                        |
| Custom            | Authentication middleware | Implements application-specific logic |

### 5. What is `next()`?

`next()` passes control to the next middleware or route handler in the processing chain.

```
function checkRequest(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.log("Request checked");
    next();
}
```

Without calling `next()`, sending a response, or forwarding an error, the request may remain pending.

### 6. Practical example: Authentication middleware

```
import { Request, Response, NextFunction } from "express";

export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
        return;
    }

    next();
}
```

This simplified example checks whether an authorization header exists. It does not validate the token; production authentication must verify the token's signature, expiration, and relevant claims.

### 7. What is error-handling middleware?

Error-handling middleware has four parameters: `err`, `req`, `res`, and `next`.

```
import {
    Request,
    Response,
    NextFunction,
} from "express";

// Centralized error handling
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.error(err.message);

    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
}
```

Register error-handling middleware after your routes. In a real application, use `next` if the handler cannot handle the error, and avoid exposing sensitive error details to clients.

### 8. Common interview follow-up questions

1\. What happens if you forget to call next()?

2\. What is the difference between app.use() and app.get()?

3\. Can middleware modify req and res?

4\. Why is middleware order important?

5\. What is the difference between authentication and authorization middleware?

One-line revision: Middleware is reusable code that executes in the Express request-response cycle to perform tasks such as logging, authentication, validation, and error handling.



Middleware is a checkpoint that checks or processes a request before it reaches the final route.



Interview answer:
“Middleware is a function in Express.js that executes during the request-response cycle. It can inspect or modify the request and response, perform tasks such as authentication, validation, and logging, and pass control to the next middleware using next() or terminate the request by sending a response.”

Senior-level follow-up: Middleware order matters because Express executes matching middleware in registration order. Poor ordering can cause security issues, unexpected behavior, or requests that never complete.