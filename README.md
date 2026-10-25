# Backend Engineering Capstone Project

A backend engineering project built with **Node.js, TypeScript, Express.js, and PostgreSQL**. This project focuses on REST API development, JWT authentication, database integration, layered architecture, error handling, structured logging, and containerized development.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcryptjs
- **Logging:** Pino
- **Containerization:** Docker and Docker Compose
- **Package Manager:** npm

## ✨ Features

### Authentication and Authorization
- User registration and login
- Password hashing using bcryptjs
- JWT-based access-token authentication
- Protected API routes
- Role-based access control for admin routes

### User Task Management
- Create tasks
- Retrieve all tasks belonging to the authenticated user
- Retrieve a task by ID
- Update task titles
- Delete tasks
- Validate task input and handle missing tasks

### Admin Task Management
- Retrieve tasks across users
- Filter tasks by title and status
- Update task statuses
- Restrict admin endpoints to authorized administrators

### Backend Engineering
- RESTful API development
- PostgreSQL integration using connection pooling
- Separation of routes, services, and repositories
- Centralized error-handling middleware
- Structured application logging with Pino
- Environment-based configuration
- Database migrations
- Docker Compose configuration

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
│   └── types/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

*The structure above is illustrative; adjust it to match the actual files in the repository.*

## ⚙️ Prerequisites

Install the following tools before getting started:

- [Node.js](https://nodejs.org/)
- npm
- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or a local PostgreSQL installation

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
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/backend_db
JWT_ACCESS_SECRET=replace_with_a_secure_random_secret
JWT_ACCESS_EXPIRES_IN=15m
LOG_LEVEL=info
```

**Important:** These values are examples. Use the variable names, database port, database name, and settings expected by your actual application configuration. Never commit your real `.env` file or secrets to GitHub.

### 4. Start PostgreSQL

If your Docker Compose configuration includes PostgreSQL, start the services:

```bash
docker compose up -d
```

Alternatively, start your local PostgreSQL server and create the database configured in your environment variables.

### 5. Run database migrations

Run the migration command configured in your project. Check `package.json` and the `migrations/` directory for the exact command and migration procedure.

### 6. Start the development server

If your project defines a `dev` script, run:

```bash
npm run dev
```

Check `package.json` for the actual available scripts.

## 🔐 API Documentation

The following endpoints reflect the route structure developed in this project. All protected endpoints require a valid access token. Admin endpoints additionally require the administrator role.

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a user | Public |
| POST | `/api/auth/login` | Log in and obtain an access token | Public |
| GET | `/api/auth/me` | Get the authenticated user's information | Authenticated |

### User Task Management

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/tasks` | Create a task | Authenticated |
| GET | `/api/tasks` | List the current user's tasks | Authenticated |
| GET | `/api/tasks/:taskId` | Retrieve a task by ID | Authenticated |
| PATCH | `/api/tasks/:taskId` | Update a task title | Authenticated |
| DELETE | `/api/tasks/:taskId` | Delete a task | Authenticated |

### Admin Task Management

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/admin/tasks` | List and filter tasks | Admin |
| PATCH | `/api/admin/tasks/:taskId/status` | Update a task's status | Admin |

*These paths assume the API router is mounted under `/api`. Confirm the final route registrations and supported status values in the code.*

## 🧪 API Usage Examples

### Register a user

**Request**

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

### Log in

**Request**

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

Use the returned access token for protected endpoints.

### Create a task

**Request**

```http
POST /api/tasks
Authorization: Bearer <your_access_token>
Content-Type: application/json
```

```json
{
  "title": "Complete backend API"
}
```

### Filter admin tasks

**Request**

```http
GET /api/admin/tasks?search=login&status=OPEN
Authorization: Bearer <admin_access_token>
```

The admin listing supports title search and status filtering, subject to the validation rules implemented by the service.

### Update a task status

**Request**

```http
PATCH /api/admin/tasks/<task_id>/status
Authorization: Bearer <admin_access_token>
Content-Type: application/json
```

```json
{
  "status": "RESOLVED"
}
```

Use an existing task ID and an administrator's access token. The accepted status values must match those defined in the application.

## 🧱 Architecture

The project follows a layered architecture that separates responsibilities.

| Layer | Responsibility |
|---|---|
| Routes | Define API endpoints and handle HTTP requests and responses |
| Services | Implement business rules, validation, and application logic |
| Repositories | Execute database queries and manage data access |
| Middleware | Handle authentication, authorization, and request processing |
| Configuration | Load environment settings and configure application dependencies |
| Types | Define TypeScript contracts for users, tasks, and Express request extensions |
| Error Handling | Standardize application errors and HTTP error responses |

### Request Flow

```text
Client / Postman
       |
       v
Express Routes
       |
       v
Authentication / Authorization
       |
       v
Service Layer
       |
       v
Repository Layer
       |
       v
PostgreSQL
```

## 🔒 Security Practices

- Hash passwords before storing them.
- Keep JWT secrets and database credentials private.
- Use parameterized SQL queries.
- Validate request data before processing it.
- Verify JWT signatures and expiration.
- Restrict protected routes to authenticated users.
- Enforce authorization checks on admin endpoints.
- Ensure users can access only their own tasks.
- Avoid exposing sensitive database details in error responses.
- Use HTTPS and secure environment configuration in production.

## 🧪 Testing

You can test the REST API using [Postman](https://www.postman.com/) or another API client.

Recommended test scenarios include:

- Successful registration and login
- Duplicate email registration
- Invalid credentials
- Missing, invalid, and expired access tokens
- Task creation with valid and invalid input
- User task ownership and access restrictions
- Updating and deleting existing tasks
- Admin-only endpoint authorization
- Invalid task status values
- Missing tasks and database errors

## 📚 Learning Outcomes

This project provides practical experience with:

- Node.js and TypeScript backend development
- REST API design with Express.js
- Authentication and authorization
- PostgreSQL and SQL queries
- Repository and service patterns
- Middleware and centralized error handling
- Structured logging and debugging
- Environment configuration
- Database migrations
- Docker-based development
- Secure and maintainable backend design

## 👨‍💻 Author

**Dipanshu Mishra**

GitHub: [@mdipanshu713-creator](https://github.com/mdipanshu713-creator)

## 📄 License

No license has been specified in this README. Add an appropriate `LICENSE` file if you intend to define how others may use, modify, or distribute this project.
