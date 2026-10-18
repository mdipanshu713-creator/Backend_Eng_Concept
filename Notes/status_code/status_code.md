# HTTP Status Codes — Complete Guide for Backend Developers

HTTP status codes tell the client what happened when the server processed a request. In your Node.js, Express, and JWT project, you'll use them to communicate successful requests, validation errors, authentication failures, and server problems.

HTTP status codes have five main categories:

| Range | Category      | Meaning                                      |
| ----- | ------------- | -------------------------------------------- |
| `1xx` | Informational | Request received; processing continues       |
| `2xx` | Success       | Request succeeded                            |
| `3xx` | Redirection   | Further action or redirection is needed      |
| `4xx` | Client error  | The request has a problem                    |
| `5xx` | Server error  | The server failed to process a valid request |

## 1. Success codes — `2xx`

These are the most commonly used codes in REST APIs.

| Code  | Name                          | When to use it                                                           |
| ----- | ----------------------------- | ------------------------------------------------------------------------ |
| `200` | OK                            | Request succeeded; common for GET and successful login                   |
| `201` | Created                       | A resource was successfully created, such as a new user                  |
| `202` | Accepted                      | Request accepted for asynchronous processing                             |
| `203` | Non-Authoritative Information | Response metadata indicates information from a transforming intermediary |
| `204` | No Content                    | Request succeeded, but no response body is returned                      |
| `205` | Reset Content                 | Client should reset the current view or form                             |
| `206` | Partial Content               | Server returns part of a resource, such as a range of a file             |

In your authentication API:

```
// Registration succeeded
res.status(201).json({
  message: "User registered successfully"
});

// Login succeeded
res.status(200).json({
  accessToken
});

// Logout succeeded with no response body
res.status(204).end();
```

## 2. Redirection codes — `3xx`

These tell the client that a resource has moved or another request action is needed.

| Code  | Name               | When to use it                                         |
| ----- | ------------------ | ------------------------------------------------------ |
| `300` | Multiple Choices   | Multiple representations or destinations are available |
| `301` | Moved Permanently  | Resource has permanently moved                         |
| `302` | Found              | Temporary redirection                                  |
| `303` | See Other          | Follow a different URL, typically with GET             |
| `304` | Not Modified       | Cached representation can be reused                    |
| `305` | Use Proxy          | Deprecated                                             |
| `306` | Unused             | Reserved; not in current use                           |
| `307` | Temporary Redirect | Temporary redirect preserving the HTTP method          |
| `308` | Permanent Redirect | Permanent redirect preserving the HTTP method          |

For typical JSON APIs, you won't use redirection responses as frequently as `200`, `201`, or `400`.

## 3. Client error codes — `4xx`

These are especially important for Express APIs, login systems, and JWT authentication.

| Code  | Name                            | Example                                                              |
| ----- | ------------------------------- | -------------------------------------------------------------------- |
| `400` | Bad Request                     | Missing email or invalid request body                                |
| `401` | Unauthorized                    | Missing, invalid, or expired access token; invalid login credentials |
| `402` | Payment Required                | Reserved for future use; sometimes used by payment systems           |
| `403` | Forbidden                       | Authenticated user lacks permission                                  |
| `404` | Not Found                       | User, product, or API route doesn't exist                            |
| `405` | Method Not Allowed              | `POST` used where only `GET` is supported                            |
| `406` | Not Acceptable                  | Server cannot provide an acceptable response format                  |
| `407` | Proxy Authentication Required   | Proxy requires authentication                                        |
| `408` | Request Timeout                 | Server timed out waiting for the request                             |
| `409` | Conflict                        | Email already registered or resource conflict                        |
| `410` | Gone                            | Resource is permanently unavailable                                  |
| `411` | Length Required                 | Required `Content-Length` is missing                                 |
| `412` | Precondition Failed             | A request condition was not met                                      |
| `413` | Content Too Large               | Request body exceeds the allowed size                                |
| `414` | URI Too Long                    | Request URL is too long                                              |
| `415` | Unsupported Media Type          | Unsupported content type, such as an unexpected request format       |
| `416` | Range Not Satisfiable           | Requested file range cannot be served                                |
| `417` | Expectation Failed              | Server cannot satisfy the `Expect` header                            |
| `418` | I'm a Teapot                    | April Fools' status code; not for ordinary API errors                |
| `421` | Misdirected Request             | Request sent to a server unable to respond to that target            |
| `422` | Unprocessable Content           | Request syntax is valid, but its instructions or data are invalid    |
| `423` | Locked                          | Resource is locked; commonly associated with WebDAV                  |
| `424` | Failed Dependency               | Request failed because a dependent request failed                    |
| `425` | Too Early                       | Server declines a request that might be replayed                     |
| `426` | Upgrade Required                | Client must switch to a different protocol                           |
| `428` | Precondition Required           | Server requires a conditional request                                |
| `429` | Too Many Requests               | Rate limit exceeded                                                  |
| `431` | Request Header Fields Too Large | Request headers are too large                                        |
| `451` | Unavailable For Legal Reasons   | Resource unavailable due to legal restrictions                       |

### The most important distinction: 400 vs 401 vs 403 vs 404 vs 409 vs 422

400

Bad Request

The request is malformed or missing required input.

Example: email or password is missing.

401

Unauthorized

Authentication is missing or invalid.

Example: incorrect login credentials or an invalid JWT.

403

Forbidden

The request is understood, but the authenticated user lacks permission.

Example: a normal user tries to access an administrator-only endpoint.

404

Not Found

The requested route or resource cannot be found.

409

Conflict

The request conflicts with the current resource state.

Example: registering an email that already exists.

422

Unprocessable Content

The request is syntactically valid, but its data fails semantic validation.

Example: a field violates a business rule.

## 4. Server error codes — `5xx`

These indicate that the server or an upstream service could not successfully complete the request.

| Code  | Name                            | Example                                            |
| ----- | ------------------------------- | -------------------------------------------------- |
| `500` | Internal Server Error           | Unexpected application exception                   |
| `501` | Not Implemented                 | Server doesn't support the requested functionality |
| `502` | Bad Gateway                     | Gateway receives an invalid upstream response      |
| `503` | Service Unavailable             | Server is temporarily unavailable or overloaded    |
| `504` | Gateway Timeout                 | Gateway doesn't receive a timely upstream response |
| `505` | HTTP Version Not Supported      | HTTP version isn't supported                       |
| `506` | Variant Also Negotiates         | Server content-negotiation configuration error     |
| `507` | Insufficient Storage            | Server cannot store the representation             |
| `508` | Loop Detected                   | Server detects an infinite processing loop         |
| `510` | Not Extended                    | Further extensions are required                    |
| `511` | Network Authentication Required | Network access requires authentication             |

For your Express application, `500` is the most common general-purpose server error. A database outage, for example, may result in `500`, or a deliberately configured `503` if the application is unavailable.

## 5. Informational codes — `1xx`

These are mostly handled by HTTP infrastructure rather than ordinary application controllers.

| Code  | Name                | Meaning                                             |
| ----- | ------------------- | --------------------------------------------------- |
| `100` | Continue            | Client can continue sending its request             |
| `101` | Switching Protocols | Server switches protocols                           |
| `102` | Processing          | Request is being processed; associated with WebDAV  |
| `103` | Early Hints         | Sends preliminary headers before the final response |

## 6. Which status codes should you use in your Node.js project?

Here is a practical reference for your authentication service.

| Operation                                       | Recommended status |
| ----------------------------------------------- | ------------------ |
| User registered successfully                    | `201`              |
| Login successful                                | `200`              |
| Profile retrieved successfully                  | `200`              |
| Invalid or missing login fields                 | `400`              |
| Invalid email or password                       | `401`              |
| Missing or invalid JWT                          | `401`              |
| User lacks the required role                    | `403`              |
| Requested user doesn't exist                    | `404`              |
| Email already registered                        | `409`              |
| Request body fails semantic validation          | `422`              |
| Rate limit exceeded                             | `429`              |
| Unexpected application error                    | `500`              |
| Database or application temporarily unavailable | `503`              |

These are common choices, not rigid rules for every API design.

### Example: Express error handling

```
app.use((err, req, res, next) => {
  const statusCode = err.statusCode ?? 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal server error"
        : err.message,
  });
});
```

This example assumes your custom errors expose a `statusCode` property. In production, use proper TypeScript types and ensure unexpected internal error details aren't exposed to clients.

## 7. Quick interview quiz

1\. A user sends an expired JWT. Which status should your API normally return?

200 OK

401 Unauthorized

403 Forbidden

2\. A logged-in user tries to access an admin-only route. Which status is appropriate?

401

403

409

3\. Registration succeeds and creates a new user. Which status is most appropriate?

200

201

204

4\. The client exceeds the API rate limit. Which status should be returned?

408

422

429

5\. Your server encounters an unexpected exception. Which status is the usual fallback?

404

500

503

Reset quiz

Remember these six first: `200` success, `201` created, `400` bad request, `401` unauthenticated, `403` forbidden, and `500` server error. These are an excellent foundation for backend coding interviews.