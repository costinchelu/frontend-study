

| **Storage Type**              | **Lifetime**       | **Sent automatically to server?** | **Typical Use**               |
| ----------------------------- | ------------------ | --------------------------------- | ----------------------------- |
| Cookies                       | configurable       | Yes (for matching domains)        | Sessions, authentication      |
| Session Storage               | Tab lifetime       | No                                | Temporary UI state            |
| Local Storage                 | Persistent         | No                                | Preferences, cached data      |
| IndexedDB                     | Persistent         | No                                | Large client-side databases   |
| Memory (JavaScript variables) | Until page refresh | No                                | Runtime state                 |
| Cache Storage                 | Persistent         | No                                | Service Workers, offline apps |

**They are the only browser storage automatically sent to the server.**

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

Controls cross-site requests.

```http
Set-Cookie: JSESSIONID=abc123; SameSite=Lax
```

Options:

| **Value** | **Meaning**                          |
| --------- | ------------------------------------ |
| Strict    | Only same-site                       |
| Lax       | Same-site + normal navigation        |
| None      | Cross-site allowed (requires Secure) |

Very important for **CSRF protection.**

------

### **Max-Age / Expires**

```http
Set-Cookie: token=abc; Max-Age=3600
```

Expires after 1 hour.



Without it:

```http
Set-Cookie: token=abc
```

Session cookie.

Deleted when browser closes.

------

# **3. Traditional Session Authentication**

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

The cookie does NOT contain the session data.

Only:

```text
JSESSIONID=abc123
```

The actual session is on the backend.



Think:

```text
Cookie = Hotel room key

Session = Actual room
```

------

# **4. JWT Authentication**

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

# **5. Where to Store JWT?**

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

# **6. Local Storage**

Accessible from Angular:

```typescript
localStorage.setItem("theme", "dark");
```

Read:

```typescript
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

# **7. Session Storage**

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

# **8. IndexedDB**

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

# **9. Browser Memory**

Angular services often hold state:

```typescript
@Injectable()
export class UserService {
   currentUser: User;
}
```

This lives only in memory.



Refresh page:

```text
Lost
```

Close tab:

```text
Lost
```

Fastest but least persistent.

------

# **10. Security Threats**

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

- HttpOnly cookies

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

# **11. Typical Modern Angular + Spring Boot Setup**

A common secure architecture today is:

```text
Angular SPA
        |
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

# **12. Mental Model Summary**

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

------

For future questions, I suggest we build the discussion around a concrete login flow and trace exactly what happens after:

1. User logs in.
2. Spring Security creates a session or JWT.
3. Chrome stores something.
4. Angular sends subsequent requests.
5. User refreshes the page.
6. User closes and reopens the browser.
7. Session expires.

That walkthrough tends to make all the storage types and security implications “click” very quickly.