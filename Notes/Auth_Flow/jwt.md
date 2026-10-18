

## 1. What is JWT?

JWT stands for JSON Web Token. It is a compact format for securely transmitting claims (information) between two parties.

In web applications, JWTs are commonly used to prove that a user has authenticated and to carry information such as the user's ID or role.

Imagine you're building an e-commerce application.

1. A user enters their email and password.
2. The backend verifies the credentials.
3. The backend creates an access token.
4. The client sends that token with subsequent requests.
5. The backend verifies the token before allowing access to protected resources.

1\. User logs in

Email + password

2\. Backend verifies credentials

Database lookup + password-hash comparison

3\. JWT is issued

Signed token returned to the client

4\. Client requests protected resources

Sends token; backend verifies it

### Why do we need JWT?

HTTP is fundamentally stateless: one request does not automatically tell the server that the previous request came from an authenticated user.

JWT provides a way for the client to present a signed credential on subsequent requests without the server necessarily storing a separate session record for every access token.

For example, after logging in, a user can request:

```
GET /api/orders
Authorization: Bearer <access_token>
```

The backend verifies the token and then decides whether the user is authorized to view their orders.

Important: JWT is a token format, not an encryption method by default. A typical signed JWT can be read by anyone who obtains it. Its signature protects its integrity, not the confidentiality of its contents.

## 2. What does a JWT look like?

A typical signed JWT has three parts separated by dots:

Header

.

Payload

.

Signature

Header.Payload.Signature

A real token looks roughly like this:

HEADER

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

PAYLOAD

eyJzdWIiOiIxMjMiLCJyb2xlIjoidXNlciJ9

SIGNATURE

A cryptographic signature, represented as encoded text

These are the three components. The example above is illustrative, not a complete usable authentication credential.

### Part 1: Header

The header describes the token's metadata, especially its signing algorithm.

Decoded example:

```
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`: the signing algorithm, here HMAC-SHA256.
- `typ`: the token type, here JWT.

The header is Base64URL-encoded to form the first section of the token.

### Part 2: Payload

The payload contains claims, meaning statements about the user or token.

Example:

```
{
  "sub": "123",
  "email": "user@example.com",
  "role": "user",
  "iat": 1792252800,
  "exp": 1792253700
}
```

Common claims:

| Claim | Meaning                                  |
| ----- | ---------------------------------------- |
| `sub` | Subject, commonly the user's unique ID   |
| `iat` | Issued-at time                           |
| `exp` | Expiration time                          |
| `iss` | Issuer, the system that issued the token |
| `aud` | Audience, the intended recipient         |
| `jti` | Unique token identifier                  |

The `iat` and `exp` values are Unix timestamps in seconds.

Never put passwords, password hashes, API secrets, or other sensitive information in an ordinary JWT payload. Base64URL encoding is not encryption.

### Part 3: Signature

The signature helps the server detect whether the token's signed contents have been changed.

For an HS256 token, conceptually:

```
signature = HMAC-SHA256(
    secret_key,
    base64url(header) + "." + base64url(payload)
)
```

The signature is then Base64URL-encoded and appended to the token.

If someone changes the payload—for example, changing `"role": "user"` to `"role": "admin"`—the original signature will no longer validate against the modified contents.

That is why a correctly implemented server must verify the signature, rather than simply trust the decoded payload.

## 3. How JWT authentication works internally

Let's follow a complete login and subsequent request.

## Phase A — Login

1. The client sends an email and password to `POST /auth/login` over HTTPS.
2. The Express controller calls your `loginUser(email, password)` service.
3. The service calls `findUserByEmailWithPassword(email)` to retrieve the user record from PostgreSQL.
4. The service compares the submitted password with `password_hash` using a suitable password-hashing library, such as Argon2id or bcrypt.
5. If the password is correct, the server signs a JWT containing appropriate claims, such as the user ID and expiration.
6. The server returns the access token to the client.

## Phase B — Access a protected route

1. The client requests `GET /api/orders` and sends the token in the `Authorization` header.
2. Authentication middleware extracts the token.
3. The middleware verifies its signature, expiration, and any required issuer or audience constraints.
4. If valid, the middleware establishes the authenticated identity, often as `req.user`.
5. Authorization logic checks whether the user is permitted to access the requested resource.
6. The controller retrieves the orders and sends the response.

One distinction matters here: authentication answers "Who are you?", while authorization answers "What are you allowed to do?"

A valid JWT can establish identity, but it does not automatically grant permission to every endpoint.

## 4. JWT implementation in Node.js and TypeScript

Let's use the `jsonwebtoken` package for a practical example.

Install the dependencies:

```
npm install jsonwebtoken
npm install -D @types/jsonwebtoken
```

Keep the signing secret in an environment variable, not directly in your source code.

```
JWT_SECRET=your-long-random-secret
```

Use a strong, randomly generated secret in real applications, and never commit the `.env` file to GitHub.

### Step 1 — Generate an access token

```
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

export function generateAccessToken(userId: string, role: string) {
  return jwt.sign(
    { role },
    JWT_SECRET,
    {
      subject: userId,
      expiresIn: "15m",
      algorithm: "HS256"
    }
  );
}
```

Understand this line:

```
jwt.sign({ role }, JWT_SECRET, {
  subject: userId,
  expiresIn: "15m",
  algorithm: "HS256"
});
```

- `jwt.sign()` creates a signed token.
- `{ role }` adds the role claim to the payload.
- `JWT_SECRET` is the key used to create the signature.
- `subject: userId` sets the standard `sub` claim.
- `expiresIn: "15m"` makes the token expire after 15 minutes.
- `algorithm: "HS256"` explicitly selects the signing algorithm.

The user ID is included as the standard subject claim rather than duplicated inside the payload.

### Step 2 — Return the token from the login service

Your earlier function declared this return type:

```
Promise<{ accessToken: string }>
```

That means your login service could return the generated token like this:

```
const accessToken = generateAccessToken(
  user.id,
  user.role
);

return { accessToken };
```

This snippet assumes that `user` has already been found and the password has been successfully verified. It does not replace those steps.

### Step 3 — Verify the token

```
import jwt from "jsonwebtoken";

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET, {
    algorithms: ["HS256"]
  });
}
```

`jwt.verify()` checks the signature and validates standard time-based claims such as `exp`, if present. Specifying the accepted algorithm prevents the verifier from accepting an unexpected algorithm.

In production, also validate the expected issuer and audience where applicable, and validate the payload's shape before trusting application-specific claims such as `role`.

Do not use `jwt.decode()` as an authentication check. Decoding reads token contents without verifying the signature.

### Step 4 — Create Express authentication middleware

This connects JWT to your `req`, `res`, and `next` knowledge.

```
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;

  if (!token) {
    return res.status(401).json({
      message: "Access token required"
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"]
    });

    if (typeof payload === "string" || !payload.sub) {
      return res.status(401).json({
        message: "Invalid access token"
      });
    }

    // Attach the verified identity for downstream handlers.
    res.locals.userId = payload.sub;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired access token"
    });
  }
}
```

Here is what happens:

- `req.headers.authorization` reads the incoming authorization header.
- `Bearer ` is the conventional prefix used to send a bearer access token.
- `jwt.verify()` validates the token.
- `payload.sub` identifies the user.
- `next()` passes control to the next handler when authentication succeeds.
- `res.status(401)` rejects a missing, invalid, or expired token.

This example puts the verified user ID in `res.locals.userId` so downstream middleware and route handlers can access it. A larger application can instead extend the Express `Request` type and attach a typed `req.user` object.

Use the middleware on protected routes:

```
app.get("/api/profile", authenticate, (req, res) => {
  res.json({
    message: "Authenticated successfully",
    userId: res.locals.userId
  });
});
```

Notice that `next()` is only called after successful verification. If verification fails, the middleware sends a response and stops that request from reaching the protected handler.

## 5. Access token vs refresh token

JWT authentication often uses two different tokens.

Access token

Short-lived credential used to access protected APIs.

- Example lifetime: 15 minutes.
- Sent with API requests.
- Should contain only necessary claims.

Refresh token

Credential used to obtain a new access token.

- Example lifetime: several days, depending on policy.
- Used with a refresh endpoint, not ordinary API requests.
- Should be protected carefully and revocable.

### Why use two tokens?

Suppose an access token lasts 15 minutes. After it expires, the client cannot use that token for protected APIs.

Instead of asking the user to enter their password again, the client can submit a valid refresh token to an endpoint such as `POST /auth/refresh`.

The backend validates the refresh token and issues a new access token. A robust design typically uses refresh-token rotation, detects reuse of old refresh tokens, and supports revocation.

A refresh token does not have to be a JWT. It can be an opaque, randomly generated token whose hash is stored server-side.

## 6. Where should JWTs be stored?

This is a critical security decision for your application.

| Storage option    | Advantages                                 | Main concern                                             |
| ----------------- | ------------------------------------------ | -------------------------------------------------------- |
| In-memory storage | Avoids persistent browser storage          | Lost on page reload; XSS can still access runtime data   |
| `localStorage`    | Easy to implement and persistent           | JavaScript-accessible, so XSS can steal tokens           |
| `HttpOnly` cookie | JavaScript cannot directly read the cookie | Requires CSRF-aware cookie configuration and protections |

For a browser-based application, an `HttpOnly`, `Secure`, appropriately configured `SameSite` cookie is often a good option. Depending on your architecture, an in-memory access token with a securely stored refresh token may also work well.

There is no universally best storage strategy. Consider your frontend, backend, cross-site requirements, XSS defenses, and CSRF protections together.

## 7. Common JWT security mistakes

Mistake 1: Trusting a decoded token

A decoded payload can be modified. Always verify the signature before trusting its claims.

Mistake 2: Putting passwords in the payload

Signed JWTs are not necessarily encrypted. Keep passwords, password hashes, and secrets out of them.

Mistake 3: Using a weak signing secret

Generate a strong random secret, protect it, and rotate it carefully when necessary.

Mistake 4: Making access tokens last too long

Long-lived stolen tokens can remain usable longer. Use suitable expiration times and a refresh strategy.

Mistake 5: Confusing authentication with authorization

A valid token does not prove that a user owns a particular order or has permission to perform an administrator action. Check resource ownership and permissions separately.

Mistake 6: Assuming logout automatically invalidates a JWT

A stateless access token may remain valid until it expires. Immediate revocation requires an additional mechanism, such as a denylist, token-version check, or another server-side control.

## 8. JWT vs session-based authentication

| Feature           | JWT-based authentication                                    | Session-based authentication                                                |
| ----------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------- |
| Server-side state | Access-token validation can be stateless                    | Session state is stored server-side                                         |
| Client sends      | Token                                                       | Session cookie                                                              |
| Revocation        | Requires additional design for immediate invalidation       | Often straightforward by deleting the session                               |
| Scaling           | Can simplify verification across services                   | Requires shared session storage or suitable architecture across instances   |
| Best use          | Distributed APIs and services where token-based access fits | Traditional web applications and systems needing centrally managed sessions |

Neither approach is automatically more secure. A well-designed session system can be better than a poorly implemented JWT system, and vice versa.

## 9. Test your understanding

1\. What does the JWT signature protect?

The confidentiality of the payload

The integrity and authenticity of the signed contents

The password stored in PostgreSQL

2\. What should the backend do before trusting JWT claims?

Only decode the payload

Verify the token and validate the required claims

Check whether the token is a non-empty string

3\. What does next() do in successful Express authentication middleware?

Creates a JWT automatically

Continues to the next middleware or handler

Deletes the user's database record

4\. What is the primary purpose of a refresh token?

Store the user's password

Obtain a new access token after the old one expires

Replace password hashing

Try again

## 10. Interview-ready summary

If an interviewer asks, "Explain JWT authentication," you can answer:

> JWT is a compact token format commonly used for authentication and authorization in web applications. It consists of a header, payload, and signature. After verifying a user's credentials, the backend signs a token containing appropriate claims and returns it to the client. The client sends the token with subsequent requests, and authentication middleware verifies the signature and relevant claims before allowing the request to continue. JWT payloads are not confidential by default, so sensitive information must not be stored in them. Token expiration, secure storage, refresh-token handling, and authorization checks are important parts of a secure implementation.

My recommendation for your Node.js project: master the complete flow in this order: password hashing → PostgreSQL user lookup → password verification → access-token generation → Express authentication middleware → role-based authorization → refresh-token rotation and logout. That sequence will give you a solid understanding of real-world backend authentication.