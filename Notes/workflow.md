[HTTP Request] 
      │
      ▼
 1. Routes (e.g., auth.routes.ts) ──► Matches URL & forwards request
      │
      ▼
 2. Middlewares (e.g., auth.middleware.ts) ──► Validates JWT / Checks permissions
      │
      ▼
 3. Services (e.g., admin.task.service.ts) ──► Executes core business logic
      │
      ▼
 4.Repositories (e.g., admin.task.repository.ts) ──► Fetches/Updates database