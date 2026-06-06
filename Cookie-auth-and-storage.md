| **Storage Type**              | **Lifetime**       | **Sent automatically to server?** | **Typical Use**               |
| ----------------------------- | ------------------ | --------------------------------- | ----------------------------- |
| Cookies                       | configurable       | Yes (for matching domains)        | Sessions, authentication      |
| Session Storage               | Tab lifetime       | No                                | Temporary UI state            |
| Local Storage                 | Persistent         | No                                | Preferences, cached data      |
| IndexedDB                     | Persistent         | No                                | Large client-side databases   |
| Memory (JavaScript variables) | Until page refresh | No                                | Runtime state                 |
| Cache Storage                 | Persistent         | No                                | Service Workers, offline apps |

**Cookies are the only browser storage automatically sent to the server.**

Example:

```http
GET /api/profile

Cookie: JSESSIONID=abc123
```

The browser sends the cookie without Angular doing anything.

------

## **How a cookie is created**

Spring Boot:

```java
response.addCookie(cookie);
```

or

```http
Set-Cookie: JSESSIONID=abc123
```

Response:

```http
HTTP/1.1 200 OK

Set-Cookie: JSESSIONID=abc123
```

Chrome stores it.

------

## **Cookie Attributes**

### **HttpOnly**

```http
Set-Cookie: JSESSIONID=abc123; HttpOnly
```

JavaScript cannot read it.

Angular:

```javascript
document.cookie
```

won’t show it to **protect against XSS stealing session cookies.**

------

### **Secure**

```http
Set-Cookie: JSESSIONID=abc123; Secure
```

Sent only over HTTPS.

------

### **SameSite**

Controls cross-site requests and it is very important for **CSRF protection.**

```http
Set-Cookie: JSESSIONID=abc123; SameSite=Lax
```

Options:

| **Value** | **Meaning**                          |
| --------- | ------------------------------------ |
| Strict    | Only same-site                       |
| Lax       | Same-site + normal navigation        |
| None      | Cross-site allowed (requires Secure) |

------

### **Max-Age / Expires**

```http
Set-Cookie: token=abc; Max-Age=3600
```

Expires after 1 hour. Without it, the cookie will be (usually) deleted when browser closes (**session cookie**). Setting an age or expiration will result in a **persistent cookie** (that will persist util it expires).

------

# **Traditional Session Authentication**

This is the classic Spring Boot approach.

## **Login**

User submits:

```http
POST /login
```

Spring Security authenticates.

Creates server-side session:

```java
HttpSession session
```

Server:

```text
Session ID: abc123

Stored on server:
{
    userId: 42,
    username: "costin",
    roles: [...]
}
```

Browser receives:

```http
Set-Cookie: JSESSIONID=abc123
```

------

## **Next Request**

Angular:

```typescript
this.http.get("/api/profile")
```

Browser automatically adds:

```http
Cookie: JSESSIONID=abc123
```

Server:

```text
Lookup session abc123
```

User is recognized.

------

## **Important Concept**

The cookie does NOT contain the session data (but only an id). The actual session is on the backend.

Think:

```text
Cookie = Hotel room key

Session = Actual room
```

------

# **JWT Authentication**

Modern SPAs often use JWT.

Instead of:

```text
Cookie -> Session ID -> Server session lookup
```

we have:

```text
JWT -> contains identity
```

Example:

```text
eyJhbGciOi...
```

The token itself contains:

```json
{
  "sub": "42",
  "username": "costin",
  "roles": ["USER"]
}
```

signed by backend.

------

# **Where to Store JWT?**

This is where things become interesting.

------

## **Option A: Local Storage**

```javascript
localStorage.setItem("token", jwt);
```

Angular:

```typescript
Authorization: Bearer <token>
```

Pros:

- Simple
- Survives browser restart

Cons:

- Vulnerable to XSS

If attacker executes JS:

```javascript
localStorage.getItem("token")
```

Token stolen.

------

## **Option B: Session Storage**

```javascript
sessionStorage.setItem("token", jwt);
```

Pros:

- Removed when tab closes

Cons:

- Still vulnerable to XSS

------

## **Option C: HttpOnly Cookie**

Backend:

```http
Set-Cookie:
accessToken=jwt;
HttpOnly;
Secure;
SameSite=Lax
```

Pros:

- Cannot be stolen by JavaScript

Cons:

- Requires CSRF protection strategy

This is often considered the most secure approach today.

------

# **Local Storage**

Accessible from Angular:

```typescript
localStorage.setItem("theme", "dark");

localStorage.getItem("theme");
```

Stored even after:

- Browser restart
- Computer reboot

Good for:

- Theme
- User preferences
- Cached UI settings

Bad for:

- Passwords
- Sensitive tokens

------

# **Session Storage**

Similar:

```typescript
sessionStorage.setItem(...)
```

But scoped to a single tab.



Open new tab:

```text
Empty sessionStorage
```

Close tab:

```text
Destroyed
```

Useful for:

- Multi-step forms
- Temporary navigation state

------

# **IndexedDB**

Much larger storage.

Think:

```text
Browser database
```

Example:

```text
Offline email
Offline notes
Offline CRM
Offline maps
```

Can store:

- Objects
- JSON
- Files
- Blobs

Capacity is much larger than localStorage.

------

# **Browser Memory**

Angular services often hold state:

```typescript
@Injectable()
export class UserService {
   currentUser: User;
}
```

This lives only in memory.

Refresh page or close tab, JS is reloaded to memory and everything is lost.

Fastest but least persistent.

------

# **Security Threats**

The two biggest concepts to understand are:

## **XSS (Cross-Site Scripting)**

Attacker injects JS:

```javascript
localStorage.getItem("token")
```

Can steal:

- localStorage
- sessionStorage

Cannot steal:

- **HttpOnly** cookies

------

## **CSRF (Cross-Site Request Forgery)**

Suppose browser has:

```text
JSESSIONID=abc123
```

Attacker site:

```html
<form action="https://bank.com/transfer">
```

Browser automatically sends cookie.



This is why:

```text
SameSite
CSRF Tokens
```

exist.

------

# **Typical Modern Angular + Spring Boot Setup**

A common secure architecture today is:

```text
Angular SPA
        |
HTTPS
        |
Spring Boot API
```

Authentication:

```text
HttpOnly Secure Cookie
```

Cookie:

```http
access_token=...
HttpOnly
Secure
SameSite=Lax
```

Angular:

```typescript
withCredentials: true
```

Spring Security:

- Validates JWT from cookie
- No access to token from JavaScript

This combines:

- JWT stateless authentication
- Cookie security benefits

------

# **Mental Model Summary**

Think of browser storage as three categories:

### **Sent Automatically To Backend**

```text
Cookies
```

Used for:

- Sessions
- Authentication
- CSRF-related flows

------

### **Readable By Angular**

```text
Local Storage
Session Storage
IndexedDB
```

Used for:

- UI state
- Preferences
- Cached data

Not automatically sent to server.

------

### **Runtime Only**

```text
JavaScript memory
Angular services
NgRx store
Signals
```

Fastest, but disappears on refresh.

------------

----------

**Scenario 1: First Visit**

User opens:

```text
https://app.company.com
```

Chrome requests:

```http
GET /
```

No cookies yet.

Spring Boot responds:

```html
Angular application
```

Browser downloads:

```text
main.js
styles.css
...
```

At this point:

```text
Cookies: none
Local Storage: empty
Session Storage: empty
```

------

# **Scenario 2: Login**

User enters:

```text
username: costin
password: secret
```

Angular:

```typescript
this.http.post('/login', {
  username,
  password
});
```

Request:

```http
POST /login
```

Body:

```json
{
  "username": "costin",
  "password": "secret"
}
```

------

# **What Spring Security Does**

Spring Security validates credentials.

If successful:

```java
Authentication auth
```

is created.

Then Spring creates:

```java
HttpSession
```

Example:

```text
Session ID: ABC123
```

Server memory now contains:

```text
ABC123
 ├─ user: costin
 ├─ userId: 42
 ├─ roles: ADMIN
 └─ loginTime: ...
```

------

# **Response to Browser**

Spring returns:

```http
HTTP/1.1 200 OK

Set-Cookie:
JSESSIONID=ABC123;
HttpOnly;
Secure;
SameSite=Lax
```

Chrome stores:

```text
Cookie Jar
 └─ JSESSIONID=ABC123
```

------

# **Important**

At this point Angular does NOT know:

```text
ABC123
```

because:

```http
HttpOnly
```

prevents JavaScript access.

If Angular tries:

```javascript
document.cookie
```

it won’t see the session cookie.

This is intentional.

------

# **Scenario 3: User Calls API**

User clicks:

```text
My Profile
```

Angular:

```typescript
this.http.get('/api/profile');
```

Angular does not add the cookie.

Chrome does.

Request becomes:

```http
GET /api/profile

Cookie: JSESSIONID=ABC123
```

------

# **What Backend Does**

Spring Security receives:

```text
ABC123
```

Looks up:

```text
Session Store
```

Finds:

```text
ABC123 -> Costin
```

User is authenticated.

Controller executes:

```java
@GetMapping("/profile")
```

Response:

```json
{
  "name": "Costin"
}
```

------

# **Think of It Like a Museum Ticket**

Instead of:

```text
Cookie contains user information
```

think:

```text
Cookie contains ticket number
```

Example:

```text
Ticket #ABC123
```

Museum database:

```text
ABC123 -> Costin
```

The ticket itself contains almost no information.

------

# **Scenario 4: User Refreshes Page**

Press:

```text
F5
```

Angular application is destroyed.

All memory is lost.

For example:

```typescript
currentUser = ...
```

gone.

------

But cookie remains:

```text
JSESSIONID=ABC123
```

because cookies are stored separately.

Angular starts again.

Requests:

```http
GET /api/profile
```

Browser sends:

```http
Cookie: JSESSIONID=ABC123
```

User is still logged in.

Many developers think: “Refresh should log me out because Angular memory is gone.”

Why doesn’t it?

Because:

```text
Authentication state is NOT in Angular memory.
Authentication state is in the session.
```

The cookie reconnects the browser to the server session.

------

# **Scenario 5: Browser Restart**

Suppose cookie is:

```http
JSESSIONID=ABC123
```

without expiration. This is a session cookie.

Chrome closes. Cookie removed.

Session cookie gone

Reopen browser:

```text
User logged out
```

------

But if cookie has:

```http
Max-Age=86400
```

(1 day)

Chrome stores it on disk.

Browser restart:

```text
Cookie survives
```

User remains logged in.

------

# **Scenario 6: Session Timeout**

Server session timeout:

```properties
server.servlet.session.timeout=30m
```

After 30 minutes:

```text
ABC123 deleted
```

from backend's server memory.

Browser still has:

```text
JSESSIONID=ABC123
```

------

Next request:

```http
GET /api/profile

Cookie: JSESSIONID=ABC123
```

Server checks:

```text
ABC123 ?
```

Not found.

Response:

```http
401 Unauthorized
```

------

# **This Leads to a Very Important Observation**

The browser and server can become out of sync.

Browser:

```text
I have a cookie
```

Server:

```text
I no longer have that session
```

This happens constantly in real applications.

------

# **Where Are Sessions Stored?**

Many developers assume:

```text
Session = browser
```

Actually:

```text
Cookie -> browser
Session -> server
```

The session might be stored in:

### **Memory**

```text
Spring Boot process memory
```

Simple but not scalable.

------

### **Redis**

Very common.

```text
Cookie
   ↓
Session ID
   ↓
Redis
```

Multiple backend instances can share sessions.

------

### **Database**

Less common nowadays.

```text
Session ID
   ↓
Database
```

------

# **Problem in a Cluster**

Imagine:

```text
Load Balancer
       |
   ┌───┴───┐
   │       │
Node A  Node B
```

Login hits:

```text
Node A
```

Session stored:

```text
Node A memory
```

Next request hits:

```text
Node B
```

Node B:

```text
Unknown session
```

User appears logged out.

------

Solutions:

### **Sticky Sessions**

Always route same user to same node.

or

### **Shared Session Store**

Redis.

Much more common.

------

# **Why JWT Became Popular**

Traditional session:

```text
Cookie -> Session ID -> Session Lookup
```

JWT:

```text
Cookie -> JWT
```

No session lookup.

Server can validate JWT directly.

This removes:

```text
Redis
Sticky sessions
Session replication
```

which is why microservice architectures often prefer JWTs.

------

A useful next step is to compare these two side-by-side:

```text
JSESSIONID Session Authentication
vs
JWT Authentication
```

and follow the exact request/response flow for both. That’s usually where concepts like stateless authentication, refresh tokens, logout behavior, and token expiration become much clearer.

------

# **1. Cookies**

Managed primarily by the browser’s networking layer.

Example:

```http
Set-Cookie: JSESSIONID=ABC123
```

Chrome stores:

```text
JSESSIONID=ABC123
```

Special property:



✅ Automatically sent to the server.

```http
GET /api/profile

Cookie: JSESSIONID=ABC123
```

Neither Local Storage nor Session Storage behave this way.

------

# **2. Local Storage**

Managed by JavaScript.

Angular:

```typescript
localStorage.setItem("theme", "dark");
```

Chrome stores:

```text
theme = dark
```

Browser sends nothing automatically.

Request:

```http
GET /api/profile
```

No localStorage values are included.



If Angular wants to send them:

```typescript
const token = localStorage.getItem("token");

headers: {
    Authorization: `Bearer ${token}`
}
```

Angular must explicitly read and send the value.

------

# **3. Session Storage**

Similar API:

```typescript
sessionStorage.setItem("step", "3");
```

Also:



❌ Not automatically sent to server.



Main difference:

```text
Local Storage:
  survives browser restart

Session Storage:
  survives refresh
  dies when tab closes
```

------

# **A Useful Chrome DevTools View**

Open:

```text
F12
Application
```

You’ll see something like:

```text
Storage
│
├── Cookies
│    └── https://app.company.com
│
├── Local Storage
│    └── https://app.company.com
│
├── Session Storage
│    └── https://app.company.com
│
├── IndexedDB
│
└── Cache Storage
```

Chrome literally presents them as separate storage areas.

------

# **Example**

Suppose Angular executes:

```typescript
localStorage.setItem("user", "Costin");

sessionStorage.setItem("wizard", "step2");

document.cookie = "language=en";
```

Chrome now contains:

### **Cookies**

```text
language=en
```

### **Local Storage**

```text
user=Costin
```

### **Session Storage**

```text
wizard=step2
```

Three different places.

------

# **What Happens on Refresh?**

Press:

```text
F5
```

Result:

| **Storage**     | **Survives?** |
| --------------- | ------------- |
| Cookie          | Yes           |
| Local Storage   | Yes           |
| Session Storage | Yes           |
| Angular Memory  | No            |

This is why Angular services lose state after refresh but local/session storage do not.

------

# **What Happens on New Tab?**

Suppose Tab A contains:

```text
Local Storage:
theme=dark

Session Storage:
wizard=step2
```

Open Tab B.



Result:

```text
Local Storage:
theme=dark
```

visible in both tabs.



But:

```text
Session Storage:
empty
```

because each tab gets its own session storage.

This is one of the biggest practical differences between localStorage and sessionStorage.

------

# **What Happens When Browser Closes?**

| **Storage**       | **Survives Browser Restart?** |
| ----------------- | ----------------------------- |
| Local Storage     | Yes                           |
| Session Storage   | No                            |
| Session Cookie    | Usually No                    |
| Persistent Cookie | Yes                           |

------

# **One More Important Distinction**

Many developers think:

```text
Cookie == Local Storage
```

because both store key/value pairs.

But from a security perspective they’re fundamentally different:

### **Cookie**

```text
Browser ↔ Server
```

Designed for HTTP communication.

### **Local Storage**

```text
JavaScript ↔ Browser
```

Designed for client-side storage.

That’s why authentication architecture decisions often start with:

“Should the token live in a cookie or in localStorage?”

because the security properties are very different.







