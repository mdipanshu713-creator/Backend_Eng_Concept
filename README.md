# Backend Engineering Capstone Project

A backend engineering project built with **Node.js, TypeScript, Express.js, and PostgreSQL**. This project focuses on building scalable and maintainable REST APIs using layered architecture, authentication, file management, caching, background jobs, and external service integrations.

The goal is to apply practical backend engineering concepts through hands-on implementation and API testing.

## 🚀 Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| Database | PostgreSQL |
| Authentication | JWT, Google OAuth 2.0 |
| Password Hashing | bcryptjs |
| File Upload | Multer |
| Cloud Storage | Cloudinary |
| Caching | Redis |
| Background Jobs | BullMQ |
| Logging | Pino |
| Containerization | Docker, Docker Compose |
| API Testing | Postman |
| Package Manager | npm |

## ✨ Features

### 1. Authentication and Authorization
- User registration and login.
- Password hashing using bcryptjs.
- JWT-based access-token authentication.
- Protected API routes.
- Role-based access control for admin routes.
- Google OAuth 2.0 login integration.

### 2. User Task Management
- Create tasks.
- Retrieve all tasks belonging to the authenticated user.
- Retrieve a task by ID.
- Update task titles.
- Delete tasks.
- Validate task input and handle missing tasks.

### 3. Admin Task Management
- Retrieve tasks across users.
- Filter tasks by title and status.
- Update task statuses.
- Restrict admin endpoints to authorized administrators.

### 4. File Upload and Cloudinary Integration
- File upload handling using Multer.
- Memory storage for processing uploaded files.
- File validation and upload size restrictions.
- Upload images to Cloudinary using `upload_stream`.
- Reusable Cloudinary upload helper.
- Store Cloudinary image URLs and public IDs in PostgreSQL.
- Delete uploaded Cloudinary images when required.

### 5. Banner Management
- Admin banner creation with image uploads.
- Fetch banner information.
- Store image metadata in PostgreSQL.
- Upload images to Cloudinary.
- Delete associated Cloudinary images when banners are removed.

### 6. Redis Caching
- Redis integration using Docker Compose.
- Banner response caching.
- Cache-aside pattern.
- Cache frequently requested banner data.
- Cache invalidation after create, update, or delete operations.
- Reduce unnecessary database queries.

### 7. Background Jobs with BullMQ
- Redis-backed job queues.
- Producer and worker implementation.
- Background job processing.
- Queue-based task execution.
- Separation of API request handling from time-consuming operations.
- Foundation for retry handling and asynchronous workflows.

### 8. Backend Engineering
- RESTful API development.
- PostgreSQL integration using connection pooling.
- Separation of routes, controllers, services, and repositories.
- Centralized error-handling middleware.
- Structured application logging with Pino.
- Environment-based configuration.
- Database migrations.
- Docker Compose configuration.

## 📁 Project Structure

```text
Backend_Eng_Concept/
├── Error_Notes/
├── Notes/
├── migrations/
├── src/
│   ├── config/
│   ├── errors/
│   ├── lib/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── queues/
│   ├── workers/
│   └── ...
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

*This structure is illustrative. Update it to match the actual implementation in the repository.*

## ⚙️ Prerequisites

Install the following tools:

- [Node.js](https://nodejs.org/)
- npm
- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Postman](https://www.postman.com/)
- Cloudinary account
- Google OAuth credentials

## 🛠️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/mdipanshu713-creator/Backend_Eng_Concept.git
cd Backend_Eng_Concept
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a reference.

Example configuration:

```env
NODE_ENV=development
PORT=4000

DATABASE_URL=postgresql://postgres:your_password@localhost:5435/nodejs-capstone

JWT_ACCESS_SECRET=replace_with_a_secure_random_secret
JWT_ACCESS_EXPIRES_IN=15m

LOG_LEVEL=info

REDIS_URL=redis://localhost:6385

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback
```

**Important:**
- These are example variable names. Match them with your actual application configuration.
- Keep `.env` out of version control.
- Never expose database passwords, JWT secrets, Cloudinary API secrets, or OAuth credentials.
- Configure your Google OAuth redirect URI in the Google Cloud Console.

### 4. Start PostgreSQL and Redis

Start Docker services:

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

The example configuration uses:

| Service | Host Port | Container Port |
|---|---:|---:|
| PostgreSQL | 5435 | 5432 |
| Redis | 6385 | 6379 |

Use the actual ports defined in your `docker-compose.yml`. If the Node.js application also runs inside Docker Compose, connect using service names and container ports instead of host ports.

### 5. Run database migrations

Execute the migration command configured in your project.

Check `package.json` and the `migrations/` directory for the correct command.

### 6. Start the development server

```bash
npm run dev
```

Check `package.json` for the available scripts.

### 7. Start the BullMQ worker

If your project uses a separate worker process, start it using the worker script configured in `package.json`.

For example:

```bash
npm run worker
```

The command above is an example; use your actual script name.

## 🧠 Core Backend Concepts Implemented

### 1. Layered Architecture

The project separates responsibilities across different layers.

| Layer | Responsibility |
|---|---|
| Routes | Define API endpoints |
| Controllers | Handle HTTP requests and responses |
| Services | Implement business logic |
| Repositories | Execute database queries |
| Middleware | Authentication, authorization, and request processing |
| Config | Environment and application configuration |
| Lib | Reusable infrastructure clients and helpers |
| Queues | Add and manage background jobs |
| Workers | Process queued jobs |
| Errors | Centralized application error handling |

### 2. File Upload Flow

```text
Client / Postman
       |
       v
Express Route
       |
       v
Multer Middleware
       |
       v
File Validation
       |
       v
Controller
       |
       v
Service Layer
       |
       v
Cloudinary Upload
       |
       v
PostgreSQL
```

Multer handles incoming multipart file uploads. The uploaded file is processed from memory and sent to Cloudinary. The database stores the resulting image URL and public ID.

### 3. Redis Cache-Aside Pattern

```text
Client Request
      |
      v
Check Redis Cache
      |
      v
  Cache Hit?
   /      \
 Yes      No
  |        |
Return   Query PostgreSQL
  |        |
  |      Store in Redis
  |        |
   \      /
    Response
```

The application checks Redis before querying PostgreSQL. If the data is unavailable in the cache, it fetches the data from the database and stores it in Redis.

Cache invalidation is performed when relevant banner data changes.

### 4. BullMQ Background Job Flow

```text
API Request
     |
     v
Producer
     |
     v
BullMQ Queue
     |
     v
Redis
     |
     v
Worker
     |
     v
Background Job Processing
```

The producer adds jobs to a queue, and workers process them asynchronously. This helps separate time-consuming operations from the main API request-response cycle.

### 5. Google OAuth Flow

```text
Client
  |
  v
Google Login
  |
  v
Google Authorization
  |
  v
OAuth Callback
  |
  v
Verify User Information
  |
  v
Find or Create User
  |
  v
Application Authentication
```

Google OAuth allows users to authenticate through their Google accounts. The application then establishes its own authentication session or issues application tokens according to its implementation.

## 🔐 Security Practices

- Hash passwords before storing them.
- Keep credentials and secrets in environment variables.
- Use parameterized SQL queries.
- Validate request data before processing.
- Verify JWT signatures and expiration.
- Enforce authentication and role-based authorization.
- Ensure users can access only their own resources.
- Validate uploaded files and enforce size limits.
- Avoid exposing sensitive error details.
- Secure OAuth callback and token-handling flows.
- Use HTTPS and secure environment configuration in production.

## 🧪 API Testing

The REST APIs are tested using Postman.

Recommended test scenarios:

- Successful registration and login.
- Duplicate email registration.
- Invalid credentials.
- Missing, invalid, and expired access tokens.
- User task CRUD operations.
- Admin authorization.
- File upload with valid and invalid files.
- Banner creation and retrieval.
- Cloudinary image deletion.
- Redis cache hit and cache miss.
- Cache invalidation after banner changes.
- Background job creation and worker processing.
- Google OAuth login and callback handling.
- Database and external service failure scenarios.

## 📚 Learning Outcomes

This project provides practical experience with:

- Node.js and TypeScript backend development.
- REST API design using Express.js.
- JWT authentication and Google OAuth.
- PostgreSQL and SQL queries.
- Layered architecture and separation of concerns.
- File uploads and cloud storage integration.
- Redis caching and cache invalidation.
- BullMQ queues and background workers.
- Docker-based development.
- Centralized error handling and structured logging.
- API testing and debugging.
- Building maintainable backend applications.

## 👨‍💻 Author

**Dipanshu Mishra**

GitHub: [@mdipanshu713-creator](https://github.com/mdipanshu713-creator)

## 📄 License

No license has been specified. Add a `LICENSE` file if you intend to define how others may use, modify, or distribute this project.
