# Routing in MERN Stack

## 1. What Is Routing?

Routing determines how an application responds to a particular URL and HTTP method.

In MERN, routing is divided into two types:

1. Backend routing — Express.js
2. Frontend routing — React Router

## 2. Backend Routing vs. Frontend Routing

| Feature | Backend Routing | Frontend Routing |
|---|---|---|
| Purpose | Handles API requests | Handles page navigation |
| Technology | Express.js | React Router |
| Main component | `express.Router()` | `BrowserRouter`, `Routes`, `Route` |
| Example | `/api/users` | `/dashboard` |
| Result | JSON data or HTTP response | React component rendered in the UI |

## 3. Backend Routing in Express.js

Backend routes receive HTTP requests, execute the relevant handler, and return a response. The handler may call services or query MongoDB.

### Common HTTP Methods

- `GET` — Retrieve data.
- `POST` — Create a resource.
- `PUT` — Replace a resource.
- `PATCH` — Partially update a resource.
- `DELETE` — Delete a resource.

### Example: `src/routes/userRoutes.ts`

```typescript
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  req.log.info("Fetching users");

  res.json({
    success: true,
    users: [],
  });
});

router.post("/register", (req, res) => {
  req.log.info("Registering a user");

  res.status(201).json({
    success: true,
    message: "User created successfully",
  });
});

export default router;
```

This example assumes `pino-http` is configured so that `req.log` is available.

### Mount the Router in `src/app.ts`

```typescript
import express from "express";
import userRouter from "./routes/userRoutes";

const app = express();

app.use(express.json());
app.use("/api/users", userRouter);

export default app;
```

### Resulting Endpoints

| Method | URL | Purpose |
|---|---|---|
| `GET` | `/api/users` | Retrieve users |
| `POST` | `/api/users/register` | Register a user |

**Important:** `express.Router()` groups related endpoints, and `app.use()` mounts those endpoints under a common URL prefix.

## 4. Frontend Routing in React

React applications commonly use client-side routing to display different views without a full-page reload.

Install React Router:

```bash
npm install react-router-dom
```

### Example: `App.jsx`

```jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### Explanation

- `BrowserRouter` — Enables browser-based routing.
- `Routes` — Groups route definitions.
- `Route` — Maps a URL path to a React element.
- `Link` — Navigates between routes without a normal full-page navigation.

## 5. How Frontend and Backend Routing Work Together

1. The user navigates to `/dashboard` using React Router.
2. React renders the `Dashboard` component.
3. The component sends a request to the Express API, such as `GET /api/users`.
4. Express matches the backend route and executes its handler.
5. The handler can query MongoDB and log relevant events using Pino.
6. Express returns JSON to React.
7. React updates the UI using the returned data.

**Remember:** Navigating to `/dashboard` does not automatically call `/api/users`. Your React component must explicitly make that API request.

## 6. Important Differences

### Frontend route

```text
/dashboard
```

Displays the dashboard interface.

### Backend route

```text
/api/users
```

Returns user data or another HTTP response.

These routes can run on different development servers, ports, or domains.

## 7. Interview Answer

Routing determines how an application handles URLs and requests. In MERN, Express routing handles backend API requests and returns responses, while React Router manages frontend navigation by rendering components based on the URL. The frontend communicates with backend routes using `fetch()` or Axios.

## 8. Quick Revision

- `express.Router()` — Groups backend routes.
- `app.use()` — Registers middleware or mounts routers.
- `GET`, `POST`, `PUT`, `PATCH`, `DELETE` — Common HTTP methods.
- `BrowserRouter` — Enables React client-side routing.
- `Routes` — Groups React route definitions.
- `Route` — Maps a path to a component.
- `Link` — Navigates without a normal page reload.
- `fetch()` / Axios — Sends HTTP requests from React to the backend.
- Pino — Logs application events.
- MongoDB — Stores and retrieves application data.
