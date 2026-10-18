# CORS Explained with a Real-Life Example

## 1. Definition

**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that controls whether a frontend from one origin is allowed to read responses from a backend on another origin.

It works through HTTP headers that communicate which origins, methods, and headers are permitted.

## 2. Real-Life Example: Office Security 🏢

Imagine your backend is a private office, and your frontend is a visitor.

- **Frontend:** The visitor requesting access.
- **Backend:** The office providing information.
- **CORS:** The office's rules about permitted visitors.
- **Browser:** The security guard enforcing these rules.

The backend sends CORS headers, and the browser checks whether the frontend is allowed to access the response.

**Important:** CORS is enforced by browsers. It is not a replacement for backend authentication or authorization.

## 3. How CORS Works in a MERN Application

Imagine you have the following setup:

- React frontend: `http://localhost:5173`
- Express backend: `http://localhost:3000`

The origins are different because their ports differ.

An **origin** consists of:

`Protocol + Hostname + Port`

For example:

- `http://localhost:5173`
- `http://localhost:3000`

These are different origins, even though both use `localhost`.

### Request flow

1. React sends a request to the Express API.
2. The browser checks the applicable CORS rules.
3. Express returns a response containing the relevant CORS headers.
4. The browser determines whether React's JavaScript can access the response.

## 4. What Happens When CORS Is Not Configured?

React sends a request:

```javascript
fetch("http://localhost:3000/users")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

If the Express response does not include the appropriate CORS headers, the browser may block JavaScript from reading the response.

You might see an error similar to:

```text
Access to fetch at 'http://localhost:3000/users'
from origin 'http://localhost:5173'
has been blocked by CORS policy.
```

**Remember:** A CORS error does not necessarily mean that the backend is down. The server may have received the request and returned a response, but the browser refused to expose that response to the frontend JavaScript.

## 5. How to Configure CORS in Express.js

### Step 1: Install the packages

```bash
npm install cors
npm install -D @types/cors
```

- `cors` provides Express middleware for configuring CORS.
- `@types/cors` provides TypeScript type declarations for the package.

### Step 2: Configure CORS

```typescript
import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/users", (_req, res) => {
  res.json({
    success: true,
    users: ["Alice", "Bob"],
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### Explanation

- `cors()` creates the CORS middleware.
- `origin` specifies the frontend origin allowed to access the response.
- `app.use()` registers the middleware.
- The `/users` route returns a JSON response.

Because the CORS middleware is registered before the route, it can add the necessary CORS headers to eligible responses.

**Production tip:** Configure an explicit allowlist of trusted frontend origins instead of allowing every origin indiscriminately.

## 6. What Is a CORS Preflight Request?

A **preflight request** is an `OPTIONS` request that a browser sends before certain cross-origin requests to check whether the intended request is permitted.

For example, a React application sends a `PUT` request with an `Authorization` header.

The browser may first send an `OPTIONS` request asking whether the server allows:

- The requesting origin.
- The `PUT` method.
- The `Authorization` header.

The server responds with appropriate CORS headers. If the preflight succeeds, the browser can proceed with the actual request.

The Express `cors` middleware can handle many preflight requests automatically when configured correctly.

**Important:** Not every cross-origin request triggers a preflight. Some requests, called simple requests, can be sent without one.

## 7. Common CORS Configuration Options

| Option | Purpose |
|---|---|
| `origin` | Specifies permitted origins |
| `methods` | Specifies permitted HTTP methods |
| `allowedHeaders` | Specifies permitted request headers |
| `credentials` | Allows credentialed cross-origin requests when configured correctly |
| `maxAge` | Controls how long browsers may cache preflight results |

Example:

```typescript
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
```

When `credentials: true` is used, the allowed origin must be explicit rather than `*`. The frontend must also opt into sending credentials where applicable, and cookie-based authentication requires appropriate cookie and security settings.

## 8. Common CORS Mistakes

1. **Wrong port:** Allowing port `3000` when React runs on port `5173`.
2. **Wrong protocol:** Confusing `http://` with `https://`.
3. **Middleware order:** Registering CORS after routes that need it.
4. **Credential mismatch:** Using wildcard origins with credentialed requests.
5. **Confusing CORS with authentication:** Assuming CORS protects an API from unauthorized clients.

## 9. Interview Answer

CORS stands for Cross-Origin Resource Sharing. It is a browser security mechanism that uses HTTP headers to determine whether a frontend from a different origin can access a backend's response. In a MERN application, we configure CORS in Express using the `cors` middleware to allow trusted frontend origins to access our APIs.

## 10. Quick Revision

- **Origin:** Protocol + hostname + port.
- **CORS:** Controls browser access to cross-origin responses.
- **Express `cors` middleware:** Configures CORS headers and permissions.
- **Preflight:** An `OPTIONS` request used to check permission before certain requests.
- **Authentication:** Verifies who the user is.
- **Authorization:** Determines what the user is allowed to do.
- **CORS is not authentication:** Non-browser clients can still send requests to your backend.

