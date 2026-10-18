# What Is `express.urlencoded()`?

## 1. Definition

`express.urlencoded()` is built-in Express middleware that parses URL-encoded form data from incoming requests and makes it available through `req.body`.

**Simple meaning:** Middleware that parses incoming HTML form submissions encoded as `application/x-www-form-urlencoded`.

## 2. Example

```typescript
import express from "express";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.post("/register", (req, res) => {
  console.log(req.body);

  res.json({
    message: "Form data received",
    data: req.body,
  });
});

app.listen(3000);
```

## 3. Input and Output

Suppose the client sends this request body:

```text
username=Dipanshu&age=25
```

Express parses it into:

```javascript
{
  username: "Dipanshu",
  age: "25"
}
```

You can access the values using:

```typescript
req.body.username;
req.body.age;
```

Note: Form values are typically strings, so `"25"` is a string, not the number `25`.

## 4. What Does `extended: true` Mean?

- `true`: Uses the `qs` parser, supporting nested objects and richer URL-encoded structures.
- `false`: Uses the simpler Node.js query-string parser.

## 5. Difference Between Body Parsers

| Middleware | Purpose |
|---|---|
| `express.json()` | Parses JSON request bodies |
| `express.urlencoded()` | Parses URL-encoded form bodies |
| `express.raw()` | Parses request bodies into a `Buffer` |
| `express.text()` | Parses request bodies as text |

For file uploads using `multipart/form-data`, use suitable middleware such as Multer.

## 6. Important Points

- It is built into Express; no separate installation is required.
- Register it before the routes that need parsed form data.
- Parsed values are available through `req.body`.
- Always validate incoming data before using it.
- `req.body` can be `undefined` when the appropriate parser is not registered or the request body does not match the parser's content type.

## 7. Interview Answer

`express.urlencoded()` is built-in Express middleware used to parse URL-encoded form data from incoming HTTP requests and make the parsed data available in `req.body`.

**Remember:** Use `express.json()` for JSON bodies and `express.urlencoded()` for URL-encoded HTML form submissions.
