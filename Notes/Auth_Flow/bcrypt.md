Let's integrate bcrypt into your Node.js + TypeScript registration flow. 🔐 Bcrypt hashes passwords before storing them in PostgreSQL, so you never save the original password.

## 1. Install bcrypt

Run this in your project terminal:

```
npm install bcrypt
npm install -D @types/bcrypt
```

## 2. Update `auth.service.ts`

Use `bcrypt.hash()` after validating the input and checking whether the email already exists.

```

import bcrypt from "bcrypt";
import { AppError } from "../errors/AppError";
import { findUserByEmail } from "../repositories/user.repository";

export async function registerUser(
  email: string,
  password: string
): Promise<void> {
  if (!email || !password) {
    throw new AppError(400, "Email and password are required");
  }

  if (password.length < 6) {
    throw new AppError(400, "Password must be at least 6 characters");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new AppError(409, "Email already registered");
  }

  // Hash the password
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Next: save normalizedEmail and passwordHash in PostgreSQL
}

```

The function is not complete until you insert the user into your database.

## 3. How bcrypt works

Plain password

`MyPassword123`

`bcrypt.hash(password, 12)`

Generates a salt and computes a password hash

Store hash in PostgreSQL

Never store the original password

### What does `12` mean?

`12` is the bcrypt cost factor, also called the number of salt rounds. A higher cost generally makes hashing slower and more resistant to brute-force attacks, but it also consumes more computing resources.

## 4. Verify the password during login

When a user logs in, you do not hash the submitted password and compare the strings. Bcrypt generates a different hash because it uses a salt.

Instead, use `bcrypt.compare()`:

```
const isPasswordValid = await bcrypt.compare(
  enteredPassword,
  user.passwordHash
);

if (!isPasswordValid) {
  throw new AppError(401, "Invalid email or password");
}
```

Remember the distinction:

- Registration → `bcrypt.hash()`
- Login → `bcrypt.compare()`

One final security point: your database should enforce a `UNIQUE` constraint on the normalized email column. Checking `findUserByEmail()` alone cannot prevent duplicate registrations in concurrent requests.