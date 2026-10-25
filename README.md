# Backend Engineering Capstone Project

A backend engineering project built with Node.js, TypeScript, Express.js, and PostgreSQL. The project focuses on layered architecture, REST API development, authentication, database integration, error handling, structured logging, and containerized development.

## 🚀 Tech Stack

- Runtime: Node.js
- Language: TypeScript
- Framework: Express.js
- Database: PostgreSQL
- Authentication: JWT (JSON Web Tokens)
- Password Hashing: bcryptjs
- Logging: Pino
- Containerization: Docker and Docker Compose
- Package Manager: npm

## ✨ Features

- REST API development with Express.js
- User registration and login
- Password hashing using bcryptjs
- JWT-based access-token authentication
- PostgreSQL integration using connection pooling
- Separation of repository and service layers
- Centralized error-handling middleware
- Structured application logging
- Environment-based configuration
- Database migrations
- Docker Compose configuration
- User task creation and retrieval

## 📁 Project Structure

# Backend Engineering Capstone Project

A backend engineering project built with Node.js, TypeScript, Express.js, and PostgreSQL. The project focuses on layered architecture, REST API development, authentication, database integration, error handling, structured logging, and containerized development.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Logging:** Pino
- **Containerization:** Docker and Docker Compose
- **Package Manager:** npm

## ✨ Features

- REST API development with Express.js
- User registration and login
- Password hashing using bcryptjs
- JWT-based access-token authentication
- PostgreSQL integration using connection pooling
- Separation of repository and service layers
- Centralized error-handling middleware
- Structured application logging
- Environment-based configuration
- Database migrations
- Docker Compose configuration
- User task creation and retrieval

## 📁 Project Structure

```
03_Capstone_Project/
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

*Adjust this tree to match the actual files and directories in the repository.*

## ⚙️ Prerequisites

Install the following:

- [Node.js](https://nodejs.org/)
- npm
- [PostgreSQL](https://www.postgresql.org/) or Docker Desktop
- Git

## 🛠️ Installation

### 1. Clone the repository

```
git clone https://github.com/mdipanshu713-creator/Backend_Eng_Concept.git
cd Backend_Eng_Concept
```

### 2. Install dependencies

```
npm install
```

### 3

Adjust this tree to match the actual files and directories in the repository.

## ⚙️ Prerequisites

Install the following:

- [Node.js](https://nodejs.org/?utm_source=chatgpt.com)
- npm
- [PostgreSQL](https://www.postgresql.org/?utm_source=chatgpt.com) or Docker Desktop
- Git

## 🛠️ Installation

### 1. Clone the repository

```
git clone https://github.com/mdipanshu713-creator/Backend_Eng_Concept.git
cd Backend_Eng_Concept
```

### 2. Install dependencies

```
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a reference.

Example configuration:

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/backend_db
JWT_ACCESS_SECRET=replace_with_a_secure_random_secret
JWT_ACCESS_EXPIRES_IN=15m
LOG_LEVEL=info
```

Replace the example credentials and secret with your own local values. Never commit your real `.env` file.

### 4. Start PostgreSQL

If you're using Docker Compose, review the configuration and start the required services:

```
docker compose up -d
```

If you're using a locally installed PostgreSQL server, ensure that the database specified in `DATABASE_URL` exists.

### 5. Run database migrations

Use the migration command defined in `package.json`. Confirm that your database is running and the environment variables are configured before running migrations.

### 6. Start the development server

Run the development script defined in `package.json`. For example, if the project uses `tsx`:

```
npm run dev
```

Check `package.json` for the exact available scripts.

## 🔐 Authentication API

The following examples assume the authentication router is mounted at `/api/auth`. Verify the actual route registration in your application.

### Register a user

Endpoint: `POST /api/auth/register`

Request body:

```
{
  "email": "user@example.com",
  "password": "your_password"
}
```

Expected success status: `201 Created`

The exact response body depends on the implementation in the authentication service and route handler.

### Login

Endpoint: `POST /api/auth/login`

Request body:

```
{
  "email": "user@example.com",
  "password": "your_password"
}
```

On successful authentication, the API should return an access token if that is the response contract implemented by your application.

### Access protected routes

Include the access token in the HTTP Authorization header:

```
Authorization: Bearer <your_access_token>
```

Replace the placeholder with the token returned by login.

## 🧱 Architecture

The project uses a layered backend structure.

- Routes: Define HTTP endpoints and handle request and response flow.
- Services: Implement business rules, validation, and authentication workflows.
- Repositories: Encapsulate PostgreSQL queries and data access.
- Middleware: Handle authentication and centralized error processing.
- Configuration: Manage environment variables and infrastructure setup.
- Utilities: Provide reusable functionality such as database connections and logging.
- Types: Define TypeScript contracts for users, tasks, and Express request extensions.

## 🧪 Testing

Use Postman or another API client to test the API. Add automated unit and integration tests as the project develops.

Recommended scenarios include:

- Valid user registration
- Duplicate email registration
- Password hashing and verification
- Successful and unsuccessful login
- Missing, invalid, and expired access tokens
- Task creation with valid and invalid input
- Retrieving only the authenticated user's tasks
- Database failures and consistent error responses

## 🔒 Security Practices

- Never commit `.env` files or credentials.
- Hash passwords before storing them.
- Use parameterized SQL queries.
- Validate incoming request data at runtime.
- Verify JWT signatures and expiration.
- Use HTTPS in production.
- Keep JWT secrets strong and private.
- Enforce unique email addresses with a database constraint.
- Apply authorization checks to protected resources.
- Avoid exposing internal database details in API errors or logs.

## 📚 Learning Objectives

This project develops practical knowledge of:

- Node.js and TypeScript backend development
- Express.js and REST API design
- Authentication and authorization
- PostgreSQL and SQL
- Layered architecture and separation of concerns
- Middleware and error handling
- Logging and debugging
- Database migrations
- Docker-based development
- Secure and maintainable backend engineering

## 👨‍💻 Author

Dipanshu Mishra

GitHub: [@mdipanshu713-creator](https://github.com/mdipanshu713-creator?utm_source=chatgpt.com)

## 📄 License

No license has been specified yet. Add an appropriate license before distributing or permitting reuse of this project. \</WritingBlock>

