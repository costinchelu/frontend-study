CORS, or **Cross-Origin Resource Sharing**, is a browser security mechanism that controls whether JavaScript running on one origin can access resources from another origin.

An **origin** is the combination of:

```text
scheme + host + port
```

For example:

```text
https://example.com
```

These are different origins:

```text
https://example.com
http://example.com
https://api.example.com
https://example.com:8443
```

## **The problem CORS solves**

Browsers enforce the **Same-Origin Policy**.

That means JavaScript loaded from:

```text
https://frontend.com
```

is not freely allowed to read responses from:

```text
https://api.com
```

Without this protection, a malicious website could make requests from a user’s browser to another site where the user is logged in, such as their bank, email provider, or admin panel, and read sensitive data.

CORS is the controlled exception to this rule. It allows a server to say: ***"Yes, I allow this other origin to access my response."***

## **Simple example**

Your frontend runs here:

```text
http://localhost:3000
```

Your backend API runs here:

```text
http://localhost:8080
```

From the browser’s perspective, these are different origins because the ports are different.

If your frontend calls:

```js
fetch("http://localhost:8080/api/users")
```

the browser sends the request, but it will only allow your frontend code to read the response <u>if the backend includes the right CORS headers.</u>

For example, the backend might respond with:

```http
Access-Control-Allow-Origin: http://localhost:3000
```

That tells the browser: ***"JavaScript from http://localhost:3000 is allowed to read this response."***

## **Important: CORS is enforced by browsers**

CORS is not usually enforced by the backend itself.

The backend sends headers. The browser checks them.

That is why a request may work from:

```bash
curl http://localhost:8080/api/users
```

but fail from browser JavaScript.

<u>curl, Postman, backend services, and server-to-server calls are not restricted by browser CORS rules.</u>

## **Common CORS headers**

### **`Access-Control-Allow-Origin`**

Specifies which origin is allowed.

```javascript
Access-Control-Allow-Origin: https://myapp.com
```

Or, for public APIs:

```javascript
Access-Control-Allow-Origin: *
```

But `*` cannot be used with credentials such as cookies or HTTP authentication.

### **`Access-Control-Allow-Methods`**

Specifies which HTTP methods are allowed.

```javascript
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

### **`Access-Control-Allow-Headers`**

Specifies which request headers the frontend is allowed to send.

```javascript
Access-Control-Allow-Headers: Content-Type, Authorization
```

This is needed when the frontend sends custom headers or headers such as `Authorization`.

### **`Access-Control-Allow-Credentials`**

Allows cookies, HTTP auth, or client certificates to be included.

```javascript
Access-Control-Allow-Credentials: true
```

On the frontend, you also need:

```js
fetch("https://api.example.com/me", {
  credentials: "include"
});
```

For Axios:

```js
axios.get("https://api.example.com/me", {
  withCredentials: true
});
```

When credentials are used, the server must not use:

```javascript
Access-Control-Allow-Origin: *
```

It must return a specific origin:

```javascript
Access-Control-Allow-Origin: https://myapp.com
Access-Control-Allow-Credentials: true
```

## **Simple requests vs preflight requests**

Some requests are considered “simple” by the browser.

For example:

```http
GET /api/products
```

with normal headers may be sent directly.

But requests like this usually trigger a **preflight request** (ask the backend whether the real cross-origin request is allowed.):

```javascript
POST /api/users
Content-Type: application/json
Authorization: Bearer ...
```

Before sending the actual request, the browser sends an `OPTIONS` request:

```http
OPTIONS /api/users
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type, authorization
```

Which means: that the browser asks the backend server: *"Server, the page from http://localhost:3000 wants to send a POST request with Content-Type and Authorization headers. Is that allowed?”*

The server must respond with something like:

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: Content-Type, Authorization
```

Browser receives the response: *“Okay, the server allows this. I can now send the real POST.”.* Only then does the browser send the real `POST`.

The Fetch/CORS standard defines a CORS-preflight request as an `OPTIONS` request that checks whether the server understands CORS for the method and headers the future request wants to use.  MDN also describes it as an automatically issued browser request using `OPTIONS`, `Origin`, `Access-Control-Request-Method`, and sometimes `Access-Control-Request-Headers`.  

Preflight is triggered by **methods other than** **`GET`****,** **`HEAD`****, or simple** **`POST`**. A `POST` request itself does **not always** trigger preflight but having **`Content-Type: application/json`** will trigger it

Why? Because `application/json` is not one of the classic CORS-safelisted form content types. A plain HTML form could historically send things like:

`Content-Type: application/x-www-form-urlencoded`
`Content-Type: multipart/form-data`
`Content-Type: text/plain`

But `application/json` is considered more “custom” from a CORS perspective, so the browser checks first.

Authorization header almost always will trigger preflight:

```javascript
fetch("http://localhost:8080/api/users", {
  headers: {
    "Authorization": "Bearer abc123"
  }
});
```

The browser asks the server:

```javascript
OPTIONS /api/users
Origin: http://localhost:3000
Access-Control-Request-Method: GET
Access-Control-Request-Headers: authorization
```

Then your backend must allow it:

```javascript
Access-Control-Allow-Headers: Authorization
```

Any custom application header usually triggers preflight:

```javascript
fetch("http://localhost:8080/api/users", {
  headers: {
    "X-Request-ID": "123",
    "X-Tenant-ID": "tenant-a"
  }
});
```

The preflight might contain:

```http
Access-Control-Request-Headers: x-request-id, x-tenant-id
```

The backend must respond with:

```http
Access-Control-Allow-Headers: X-Request-ID, X-Tenant-ID
```

Examples of requests that doesn't trigger preflight (simple GET, POSTs that looks like normal form submission):

```
fetch("http://localhost:8080/api/products");
```

```javascript
fetch("http://localhost:8080/api/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  body: "username=a&password=b"
});
```

MDN notes that simple `GET` requests are not preflighted, even when credentials are involved; instead, the browser ignores the response if the required credential-related CORS headers are missing.

```javascript
fetch("http://localhost:8080/api/me", {
  credentials: "include"
});
```

If it is a simple `GET` with no custom headers, the browser may send the real request directly, but the response still needs:

```http
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
```

Also, when credentials are used, the backend cannot use:

```http
Access-Control-Allow-Origin: *
```

It must return a specific origin.

When debugging CORS, always check the Network tab for an `OPTIONS` request before the failed request.

## **Common CORS error**

You might see something like:

```text
Access to fetch at 'http://localhost:8080/api/users'
from origin 'http://localhost:3000'
has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

This means that the browser made the request, but refused to expose the response to frontend JavaScript because the backend did not allow that origin.

## **CORS is not authentication**

A common misconception is that CORS protects your API from all unwanted clients. It does not.

CORS only controls whether browsers allow **frontend JavaScript** to read cross-origin responses.

Someone can still call your API using *curl*, Postman or from their own backend service.

So you still need real security mechanisms such as:

- authentication
- authorization
- CSRF protection where relevant
- rate limiting
- input validation

## **Backend example**

In Spring Boot, a simple controller-level example would be:

```java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    public List<User> getUsers() {
        return List.of();
    }
}
```

A broader Spring Security-style configuration might look like:

```java
@Bean
CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();

    config.setAllowedOrigins(List.of("http://localhost:3000"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

    source.registerCorsConfiguration("/**", config);

    return source;
}
```

## **Mental model**

Think of CORS like this:

```text
Frontend: "Browser, can I read data from api.example.com?"

Browser: "I will ask api.example.com."

API response:
Access-Control-Allow-Origin: https://frontend.example.com

Browser: "Okay, this API explicitly allows your frontend origin, so you may read the response."
```

In short: **CORS is a browser-enforced permission system that lets servers decide which frontend origins are allowed to read their cross-origin responses.**