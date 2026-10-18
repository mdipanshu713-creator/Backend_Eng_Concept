# Bearer Token Explained — Node.js + JWT

A Bearer token is a credential that a client sends to a server to prove it has a token that can be used to access protected resources.

In your JWT authentication project, the bearer token is your JWT access token.

Think of it like an entry pass: if the pass is valid and the server accepts it, you can access the permitted resources.

## 1. How a Bearer token works

1\. User logs in

Email + password

2\. Backend generates JWT

Using `jwt.sign()` after successful authentication

3\. Client receives the token

The token is returned in the login response

4\. Client sends a Bearer token

In the HTTP Authorization header

5\. Server verifies the JWT

Valid token → continue; invalid token → 401

## 2. What does `Bearer` mean?

Suppose your login API returns:

```
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

When requesting a protected endpoint, the client sends:

```
GET /api/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

There are two parts to this header:

- `Bearer` — identifies the authentication scheme.
- `eyJhbGciOiJIUzI1NiIs...` — the actual access token.

Important: `Bearer` is not part of the JWT itself. It is the prefix used in the HTTP header.

It is called a bearer token because whoever possesses the token can generally use it, subject to its validity and permissions. That is why you must protect it.

## 3. How to use it in Postman

[How to Handle Authentication with Postman API Testing? - GeeksforGeeks](https://images.openai.com/static-rsc-4/dxNkAgr9a6KVzp-12xGpq5akseJHs6UBuoTNF6dWQvYU5NK3rG89KFyXd87CkcbnaM17QXLuiWDo40ah9t7AXPrx-bvs5MWfVqmpHl95k3tJtYuRpMuUApCQvUCDv__2sKmL3QX_jlJMZkyBfa_pYbvMTs5SELYppwxCy7yfEqY?purpose=inline)

Step 1: Login

Send `POST /api/auth/login` with your email and password. Copy the returned `accessToken`.

[Set the bearer token automatically to each request in the postman | by Ravindra Devrani | CodeX | Medium](https://images.openai.com/static-rsc-4/o6VabDAOKmxXDvQXVr7GWkeLGErOYps2-e7I1Jp22kXe1NAjowf6kEsxiTI6Z_shcqxgN6CJSVkQn_zUDHFHGJEMCMnS6Kdr5sH8cWVIasDXe1JiUt_mwjQdRFXPyyPE_P7z6RhS7qtp1LxkCGnv7ETJWoOux4QUpFmaxTrIv1w?purpose=inline)

Step 2: Configure authorization

Open your protected request, select Authorization → Bearer Token, and paste the token into the Token field. Postman adds the header automatically.

For example, request:

```
GET http://localhost:4000/api/profile
```

If your middleware verifies the token successfully, the request proceeds to your controller.

## 4. How Express reads the Bearer token

This is the key code to understand for interviews:

```
const authHeader = req.headers.authorization;

const token = authHeader?.startsWith("Bearer ")
  ? authHeader.slice(7)
  : undefined;
```

Here's what each line does:

| Code                        | Meaning                                                 |
| --------------------------- | ------------------------------------------------------- |
| `req.headers.authorization` | Reads the HTTP Authorization header                     |
| `startsWith("Bearer ")`     | Checks that the expected prefix is present              |
| `slice(7)`                  | Removes the seven-character prefix, including the space |
| `token`                     | Contains the JWT without the `Bearer ` prefix           |

Then verify it:

```
const payload = jwt.verify(token, JWT_SECRET, {
  algorithms: ["HS256"]
});
```

If verification succeeds, the middleware calls `next()` to continue the request. If verification throws an error, the server should return `401 Unauthorized`.

## 5. Bearer token vs JWT

These terms are related, but they are not the same.

| JWT                                                             | Bearer token                                         |
| --------------------------------------------------------------- | ---------------------------------------------------- |
| A token format                                                  | An authentication scheme                             |
| Contains encoded claims and a signature when using a signed JWT | Describes how a credential is presented              |
| Can be sent using the Bearer scheme                             | Can contain a JWT or another type of token           |
| Verified according to the JWT's signing and validation rules    | Must be handled according to the credential's scheme |

## 6. Interview answer

If an interviewer asks, "What is a Bearer token?", say:

"A Bearer token is an access credential sent by the client in the HTTP Authorization header using the `Bearer` scheme. In my JWT-based authentication system, the client sends the JWT as a Bearer token to protected endpoints. Express middleware extracts the token, verifies its signature and expiration, and calls `next()` if it is valid. Otherwise, it returns an unauthorized response."

One final security rule: always use HTTPS in production, keep access tokens secure, and never log or share real tokens unnecessarily.