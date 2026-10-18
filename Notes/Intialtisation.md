# 03_Capstone_Project — Node.js + TypeScript Setup

**Environment:** Windows, VS Code, PowerShell  
**Module system:** CommonJS  
**Development runner:** tsx

## Step 1: Check Installed Tools

Open VS Code → Terminal → New Terminal.

Check Node.js:

```powershell
node --version
```

Check npm:

```powershell
npm --version
```

Verify Node.js works:

```powershell
node -e "console.log('Node.js is working')"
```

## Step 2: Check Existing Files

Display the current directory:

```powershell
Get-Location
```

List all files, including hidden files:

```powershell
Get-ChildItem -Force
```

Check `package.json`:

```powershell
if (Test-Path package.json) {
    Get-Content package.json
} else {
    Write-Output "package.json does not exist"
}
```

Check `tsconfig.json`:

```powershell
if (Test-Path tsconfig.json) {
    Get-Content tsconfig.json
} else {
    Write-Output "tsconfig.json does not exist"
}
```

Check the `src` folder:

```powershell
if (Test-Path src) {
    Get-ChildItem src -Force
} else {
    Write-Output "src folder does not exist"
}
```

**Important:** Inspect existing files before creating or modifying them.

## Step 3: Initialize the Project

Run this command only if the project does not already have a `package.json`:

```powershell
npm init -y
```

**Meaning:**
- `npm`: Node.js package manager.
- `init`: Initializes a new npm project.
- `-y`: Accepts the default answers automatically.

This creates `package.json`, which stores project metadata, scripts, and dependencies.

## Step 4: Install Development Dependencies

Install TypeScript, tsx, and Node.js type definitions:

```powershell
npm install -D typescript tsx @types/node
```

**Meaning:**

- `typescript`: Provides the TypeScript compiler and type checking.
- `tsx`: Runs TypeScript files directly and watches for changes.
- `@types/node`: Provides TypeScript definitions for Node.js APIs.
- `-D`: Saves these packages under `devDependencies`.

## Step 5: Configure package.json

Set the project to CommonJS and configure the development script.

The relevant configuration is:

```json
{
  "type": "commonjs",
  "scripts": {
    "dev": "tsx watch src/index.ts"
  }
}
```

**Important:** Merge these settings into your existing `package.json`. Do not replace the entire file because that could remove dependency information.

The `dev` script runs `src/index.ts` using tsx and automatically restarts the application when files change.

## Step 6: Create tsconfig.json

Generate a basic TypeScript configuration if one does not already exist:

```powershell
npx tsc --init
```

Then configure `tsconfig.json` with the following settings:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

**Configuration notes:**

- `target`: Specifies the JavaScript version TypeScript targets.
- `module`: Uses CommonJS modules.
- `moduleResolution`: Resolves imports using Node.js-compatible rules.
- `rootDir`: Identifies the source directory.
- `outDir`: Defines where compiled JavaScript will go.
- `strict`: Enables stricter type checking.
- `esModuleInterop`: Improves compatibility with CommonJS packages.
- `skipLibCheck`: Skips checking declaration files from dependencies.
- `types`: Includes Node.js type definitions.
- `include`: Selects TypeScript source files.
- `exclude`: Excludes generated files and installed dependencies.

Note: `tsx` runs TypeScript directly; it does not compile files into `dist`. Use `npx tsc` when you want to check and compile the project.

## Step 7: Create the Source File

Create the folder and file if they do not already exist:

```powershell
New-Item -ItemType Directory -Path src -Force
```

Create the file only if it is missing:

```powershell
if (-not (Test-Path src/index.ts)) {
    New-Item -ItemType File -Path src/index.ts
}
```

Add the following code to `src/index.ts`:

```typescript
console.log("Node.js + TypeScript setup is working!");
```

Save the file.

## Step 8: Run the Project

Start the development server:

```powershell
npm run dev
```

Expected output:

```text
Node.js + TypeScript setup is working!
```

The terminal remains active because `tsx watch` monitors the source file.

To verify automatic restarting, change the message in `src/index.ts` and save the file. The terminal should display the updated message.

Press `Ctrl + C` to stop the process.

## Step 9: Check TypeScript Compilation

Run:

```powershell
npx tsc --noEmit
```

This checks the TypeScript source without generating JavaScript files.

If no errors are reported, the TypeScript type check has passed.

## Step 10: Express, dotenv, and Pino

Install Express:

```powershell
npm install express
```

Install Express type definitions:

```powershell
npm install -D @types/express
```

Install dotenv:

```powershell
npm install dotenv
```

Install Pino and its HTTP middleware:

```powershell
npm install pino pino-http
```

**Express:** Creates HTTP routes and APIs.

**dotenv:** Loads environment variables from a `.env` file when configured in the application.

**Pino:** Provides structured logging for application events and errors.

**pino-http:** Adds HTTP request logging middleware for Express applications.

Keep these packages separate from the initial setup so you can understand the basic Node.js and TypeScript environment first.

## Step 11: Troubleshooting

### Error: `node is not recognized`

Node.js may not be installed or its installation directory may not be in PATH. Install or repair Node.js, then restart VS Code.

### Error: `npm is not recognized`

Check the Node.js installation and PATH configuration. Restart the terminal after correcting it.

### Error: `Missing script: "dev"`

Check that `package.json` contains:

```json
"scripts": {
  "dev": "tsx watch src/index.ts"
}
```

### Error: Cannot find module `tsx`

Run:

```powershell
npm install -D tsx
```

### Error: Cannot find `src/index.ts`

Check the project directory:

```powershell
Get-Location
Get-ChildItem src
```

Make sure the terminal is in the project root and the file exists.

### Error: TypeScript compilation fails

Run:

```powershell
npx tsc --noEmit
```

Read the first error and fix the reported file or configuration before trying again.

---

## Final Project Structure

```text
03_Capstone_Project/
├── node_modules/
├── src/
│   └── index.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

`node_modules/` and `package-lock.json` are generated by npm. Do not create them manually.

## Key Revision Points

- `package.json` manages project metadata, scripts, and dependencies.
- `tsconfig.json` controls TypeScript compiler behavior.
- `tsx` executes TypeScript during development.
- `@types/node` provides Node.js type definitions.
- `npm run dev` starts the development script.
- `npx tsc --noEmit` checks TypeScript without generating output.
- `npm install` records installed dependencies and updates the lockfile.
