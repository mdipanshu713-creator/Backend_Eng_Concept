# PostgreSQL `ECONNREFUSED` and Authentication Troubleshooting

## Project context

- Project: `03_Capstone_Project`
- Stack: Node.js, TypeScript, `pg` connection pool, PostgreSQL 16 in Docker Compose
- Host port: `5435`
- Container port: `5432`
- Database: `nodejs-capstone`

## What happened

The migration runner initially failed with:

```text
AggregateError [ECONNREFUSED]
connect ECONNREFUSED ::1:5435
connect ECONNREFUSED 127.0.0.1:5435
```

This means Node.js could not establish a TCP connection to PostgreSQL at `localhost:5435`. At that moment, the service might not have been ready, running, or reachable at that port.

Docker was then checked:

```powershell
docker compose ps
```

Output showed the PostgreSQL container running with this port mapping:

```text
0.0.0.0:5435->5432/tcp
```

The PostgreSQL logs later confirmed:

```text
database system is ready to accept connections
```

After the connection became reachable, a different error appeared:

```text
password authentication failed for user "postgresql"
DETAIL: Role "postgresql" does not exist.
```

This was an authentication/configuration issue, not a port issue.

## Root cause

The project's `.env` file had been corrected to use the `postgres` username:

```dotenv
DATABASE_URL=postgresql://postgres:postgres@localhost:5435/nodejs-capstone
```

However, the current PowerShell session had an existing environment variable with the old URL:

```text
postgresql://postgresql:postgres@localhost:5435/nodejs-capstone
```

The diagnostic output confirmed that Node.js was still receiving `postgresql` as the username.

By default, `dotenv.config()` does **not** overwrite environment variables that already exist in `process.env`. Therefore, the stale PowerShell variable took precedence over the corrected value in `.env`.

## Fix

In the affected PowerShell terminal, remove the stale variable:

```powershell
Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
```

Confirm it is empty:

```powershell
echo $env:DATABASE_URL
```

Then rerun the migration:

```powershell
npm run migrate
```

With the stale variable removed, `dotenv` can load the correct `DATABASE_URL` from `.env` (assuming the app loads that file and no other override is set).

### Check for a persistent Windows user variable

To see whether a `DATABASE_URL` was saved in the Windows user environment:

```powershell
[Environment]::GetEnvironmentVariable("DATABASE_URL", "User")
```

If it contains the obsolete URL and you want to remove that user-level value:

```powershell
[Environment]::SetEnvironmentVariable("DATABASE_URL", $null, "User")
```

Open a new terminal after changing a persistent environment variable. This command removes only the user-level environment variable; it does not change PostgreSQL credentials or database data.

## Useful diagnostic commands

### 1. Check the `.env` line

```powershell
Get-Content .env | Select-String "DATABASE_URL"
```

Expected:

```dotenv
DATABASE_URL=postgresql://postgres:postgres@localhost:5435/nodejs-capstone
```

### 2. Check the current PowerShell override

```powershell
echo $env:DATABASE_URL
```

If this prints a URL with `postgresql` as the username, it overrides the `.env` value for the current process.

### 3. Check Docker status and port mapping

```powershell
docker compose ps
```

Expected mapping:

```text
0.0.0.0:5435->5432/tcp
```

### 4. Check PostgreSQL startup logs

```powershell
docker compose logs postgres --tail 50
```

Look for:

```text
database system is ready to accept connections
```

### 5. Check the initialized PostgreSQL role

```powershell
docker compose exec postgres printenv POSTGRES_USER
docker compose exec postgres psql -U postgres -d nodejs-capstone -c "\du"
```

The container reported the `postgres` user and the role list included `postgres`.

### 6. Test whether the host port accepts TCP connections

```powershell
Test-NetConnection localhost -Port 5435
```

A successful connection reports:

```text
TcpTestSucceeded : True
```

## Error meanings

| Error | Meaning | What to check |
|---|---|---|
| `ECONNREFUSED` | No service accepted the TCP connection at that address and port | Container status, port mapping, startup readiness |
| `28P01` / `password authentication failed` | PostgreSQL was reached but authentication failed | Loaded username/password and existing database roles |
| `Role "postgresql" does not exist` | The client attempted to log in as a role named `postgresql` | The actual `DATABASE_URL` used by Node.js |
| `DATABASE_URL exists: false` | The application did not receive the variable | `.env` path and environment loading |

## Recommended database connection setup

Example `src/lib/db.ts`:

```typescript
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
});
```

Avoid printing the full connection string because it contains credentials. For diagnostics, print only safe fields such as the username, host, port, and database name.

## Key lessons

1. A running Docker container does not always mean PostgreSQL has finished starting.
2. `ECONNREFUSED` and authentication failures are different stages of the connection process.
3. Verify the environment value actually used by Node.js instead of trusting only the `.env` file.
4. `dotenv.config()` does not override existing environment variables by default.
5. Do not delete Docker volumes or recreate the database to fix a stale connection string.
6. `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` are initialization settings; changing them later does not automatically update an already initialized database.
7. Never commit real `.env` credentials to Git.

## Quick recovery checklist

- [ ] `.env` contains the correct `DATABASE_URL`.
- [ ] The current PowerShell session has no stale `DATABASE_URL` override.
- [ ] `docker compose ps` shows PostgreSQL running and the correct port mapping.
- [ ] PostgreSQL logs show it is ready to accept connections.
- [ ] The database username and database name match the existing database.
- [ ] Run `npm run migrate` again.
