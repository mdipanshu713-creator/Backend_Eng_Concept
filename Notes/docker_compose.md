# Docker Compose — Complete Revision Notes

Docker Compose is a tool used to define, configure, and run multiple Docker containers together using a single YAML file, usually named `compose.yaml` or `docker-compose.yml`.

For your Node.js + TypeScript capstone project, Docker Compose can run your Express backend, MongoDB database, and other required services together.

## 1. Real-life example 🏢

Imagine you're managing a restaurant.

- Node.js API = Kitchen
- MongoDB = Storage room
- Redis = Quick-access counter
- Docker Compose = Manager who starts and coordinates all the services

Instead of starting each service manually, Docker Compose lets you define how they work together.

## 2. Why do we need Docker Compose?

Without Docker Compose, you might need to run multiple commands separately to start your backend and database containers.

With Docker Compose, you define the services in one YAML file and start them together:

```
docker compose up
```

Benefits:

- Starts multiple containers together.
- Configures communication between services.
- Defines environment variables and ports.
- Creates and manages container networks.
- Supports persistent storage using volumes.
- Makes development environments easier to reproduce.

## 3. What is a Docker Compose file?

A Compose file is a YAML configuration file that describes the services your application needs.

Example project structure:

```
03_Capstone_Project/
├── src/
├── Dockerfile
├── compose.yaml
├── package.json
├── tsconfig.json
└── .env
```

## 4. Example: Node.js + MongoDB

Create a `compose.yaml` file in your project root.

```

services:
  api:
    build: .
    ports:
      - "4000:4000"
    environment:
      PORT: 4000
      MONGO_URI: mongodb://mongo:27017/capstone
    depends_on:
      - mongo

  mongo:
    image: mongo:8
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:

```

This example assumes you have a working `Dockerfile` and your application reads `MONGO_URI`.

### Explanation

| Configuration    | Meaning                                                       |
| ---------------- | ------------------------------------------------------------- |
| `services`       | Defines the containers to run                                 |
| `api`            | Name of the backend service                                   |
| `build: .`       | Builds an image using the Dockerfile in the current directory |
| `ports`          | Maps host ports to container ports                            |
| `environment`    | Passes configuration variables into a container               |
| `depends_on`     | Defines a startup dependency                                  |
| `mongo`          | Name of the database service                                  |
| `image: mongo:8` | Uses the MongoDB 8 image                                      |
| `volumes`        | Provides persistent storage                                   |
| `mongo_data`     | Named volume for database files                               |

Important: Inside the API container, use `mongo` as the database hostname, not `localhost`. Compose services can communicate using their service names on the Compose network.

Also, `depends_on` alone does not guarantee that MongoDB is ready to accept connections. Production-ready setups should account for database readiness and retry failed connections.

## 5. Important: What does `4000:4000` mean?

```
ports:
  - "4000:4000"
```

The format is:

`HOST_PORT:CONTAINER_PORT`

- First `4000` = port on your computer.
- Second `4000` = port inside the container.

You can then access the API through:

`http://localhost:4000`

Your Express server must listen on an appropriate container interface, typically `0.0.0.0`, so Docker can expose the port correctly.

## 6. Common Docker Compose commands

| Command                      | Purpose                                                               |
| ---------------------------- | --------------------------------------------------------------------- |
| `docker compose up`          | Starts the services                                                   |
| `docker compose up -d`       | Starts services in the background                                     |
| `docker compose down`        | Stops and removes the Compose containers and network                  |
| `docker compose ps`          | Shows service/container status                                        |
| `docker compose logs`        | Displays service logs                                                 |
| `docker compose logs -f api` | Follows backend logs                                                  |
| `docker compose build`       | Builds or rebuilds service images                                     |
| `docker compose restart`     | Restarts services                                                     |
| `docker compose down -v`     | Also removes named volumes, potentially deleting stored database data |

Run these commands from the directory containing `compose.yaml`.

## 7. Docker vs. Docker Compose

| Docker                                | Docker Compose                                       |
| ------------------------------------- | ---------------------------------------------------- |
| Builds and runs individual containers | Coordinates multiple services                        |
| Uses commands such as `docker run`    | Uses a YAML configuration file                       |
| Manages images and containers         | Defines service relationships, networks, and volumes |
| Useful for individual containers      | Useful for multi-service applications                |

## 8. Docker Compose vs. Dockerfile

These two files have different responsibilities.

- `Dockerfile`: Describes how to build your application's image.
- `compose.yaml`: Describes which services to run and how they interact.

For example, your Dockerfile installs dependencies and prepares the Node.js application. Your Compose file defines how that API runs alongside MongoDB.

## 9. Common mistakes

1. Using `localhost` instead of the database service name inside a container.
2. Forgetting to create the Dockerfile referenced by `build: .`.
3. Exposing a port that the application does not actually listen on.
4. Assuming `depends_on` guarantees database readiness.
5. Accidentally deleting database volumes with `docker compose down -v`.
6. Committing passwords or production secrets directly into the Compose file.

## 10. Interview answer

Docker Compose is a tool for defining and running multi-container applications using a YAML configuration file. It lets us configure services, networks, volumes, ports, and environment variables in one place. For example, we can run a Node.js backend and MongoDB together using `docker compose up`.

## Quick revision

- Docker: Containerization platform.
- Dockerfile: Defines how to build an image.
- Docker Compose: Coordinates multiple services.
- Compose file: `compose.yaml` or `docker-compose.yml`.
- Service: An application component, such as an API or database.
- Volume: Persistent storage for container data.
- Network: Enables services to communicate.
- `docker compose up`: Starts the configured services.

My recommendation: Learn Dockerfile basics first, then Docker Compose. Once you understand how to containerize your Express API, Compose will make it much easier to run your API and database together.