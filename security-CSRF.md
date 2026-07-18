## What CSRF is

**CSRF**, or **Cross-Site Request Forgery**, is an attack where a malicious site tricks a user’s browser into sending an authenticated request to another site where the user is already logged in. OWASP defines it as forcing an authenticated user to execute unwanted actions on a web application. 

The key idea is:

> The attacker does **not** steal the user’s session cookie.  
> The attacker makes the victim’s browser **use it automatically**.

Example:

1. You log into `bank.com`.
2. Your browser stores a session cookie for `bank.com`.
3. You then visit `evil.com`.
4. `evil.com` contains something like an auto-submitting form:

```html
<form action="https://bank.com/transfer" method="POST">
  <input name="to" value="attacker-account" />
  <input name="amount" value="1000" />
</form>

<script>
  document.forms[0].submit();
</script>
```

5. The browser sends the request to `bank.com`.
6. Because you are logged in, the browser may include your `bank.com` cookies.
7. If `bank.com` only checks “is this user authenticated?” and not “did this request intentionally come from my app?”, the transfer may succeed.

The attacker usually cannot read the response because of browser same-origin restrictions, but they often do not need to. For CSRF, sending the action is enough.

---

## Why CSRF happens

CSRF exists because browsers automatically attach certain credentials to requests.

Most importantly:

```http
Cookie: SESSION=abc123
```

If a request goes to `bank.com`, the browser decides whether to include `bank.com` cookies. The JavaScript or HTML on `evil.com` does not need to know the cookie value.

This is why cookie-based authentication is the classic CSRF risk. Other automatically attached credentials, such as HTTP Basic authentication or client certificates, can have similar problems.

In contrast, if your API uses a bearer token stored only in JavaScript memory and sent manually like this:

```http
Authorization: Bearer eyJ...
```

then a random malicious site cannot usually make the browser attach that header automatically. That setup is generally less exposed to classic CSRF, though it has other risks, especially around XSS.

---

## Is the frontend or backend vulnerable?

Usually, the **backend is the part that is vulnerable**, because the backend is the final authority that accepts or rejects the request.

But the frontend can contribute to the vulnerability depending on how authentication and request protection are implemented.

### Backend-side causes

A backend becomes CSRF-vulnerable when it:

1. Uses cookie-based authentication.
2. Allows state-changing actions without CSRF validation.
3. Trusts the session cookie alone.
4. Allows dangerous actions through `GET`.
5. Does not check CSRF tokens, `Origin`, `Referer`, or `SameSite` behavior.
6. Has weak CORS assumptions.

Example vulnerable endpoint:

```http
POST /api/change-email
Cookie: SESSION=abc123

email=attacker@example.com
```

If the server only checks that `SESSION=abc123` belongs to a logged-in user, this request may be accepted even if it was triggered from another site.

A worse example:

```http
GET /api/delete-account
Cookie: SESSION=abc123
```

This is very dangerous because `GET` requests can be triggered by images, links, redirects, iframes, and other simple browser mechanisms.

State-changing operations should not be done through `GET`.

---

### Frontend-side causes

A frontend can make CSRF more likely when it relies on cookies but does not include a CSRF token in requests.

For example, a SPA might call:

```js
fetch("/api/change-email", {
  method: "POST",
  credentials: "include",
  body: JSON.stringify({ email: "new@example.com" })
});
```

This is fine only if the backend also requires some proof that the request came from the legitimate frontend, such as a CSRF token.

A frontend can also contribute to CSRF problems if it:

1. Does not read and send a CSRF token.
2. Sends requests with `credentials: "include"` without proper backend protection.
3. Stores auth in cookies but assumes CORS alone protects it.
4. Has XSS vulnerabilities, because XSS can often bypass CSRF protections. OWASP explicitly notes that XSS can defeat CSRF mitigations. 

Important distinction:

**CORS is not CSRF protection.**

CORS mainly controls whether another origin can read a response from your server. It does not generally prevent a browser from sending simple cross-site requests such as form posts.

---

## What makes an endpoint CSRF-prone?

A request is CSRF-prone when all of these are true:

1. **The user is authenticated**
   
   The victim has an active session.

2. **Authentication is automatically included**
   
   Usually a cookie.

3. **The endpoint changes state**
   
   Examples: transfer money, change email, reset password, delete account, add payment method, create API key.

4. **The backend accepts the request without an anti-CSRF check**
   
   The backend trusts the cookie alone.

5. **The attacker can construct the request**
   
   Forms can send `GET` and `POST` requests cross-site. Some content types and headers are restricted, but many common form submissions are enough for CSRF.

---

## Common CSRF example

Imagine this backend:

```java
@PostMapping("/account/email")
public ResponseEntity<?> changeEmail(
    @RequestParam String email,
    HttpSession session
) {
    User user = (User) session.getAttribute("user");
    userService.changeEmail(user.getId(), email);
    return ResponseEntity.ok().build();
}
```

The issue is not the `POST` itself. The issue is that the server accepts:

```http
POST /account/email
Cookie: JSESSIONID=...
Content-Type: application/x-www-form-urlencoded

email=attacker@example.com
```

without checking whether the request was intentionally created by your own application.

A safer version would require a CSRF token:

```http
POST /account/email
Cookie: JSESSIONID=...
X-CSRF-Token: random-secret-token
Content-Type: application/json

{
  "email": "user@example.com"
}
```

Then the backend verifies that the token matches the authenticated session.

---

# How to prevent CSRF

## 1. Use CSRF tokens

The standard defense is a **CSRF token**.

A CSRF token is a secret, unpredictable value generated by the server and associated with the user’s session. The legitimate frontend includes it in state-changing requests. The attacker’s site cannot guess it, so forged requests fail. OWASP recommends CSRF tokens for applications that rely on cookies for authentication. 

Example request:

```http
POST /api/change-email
Cookie: SESSION=abc123
X-CSRF-Token: 9f1c5b7e...
```

Backend logic:

```text
if session is valid
and CSRF token is present
and CSRF token matches the expected token for this session
then allow request
else reject request
```

Use CSRF protection on unsafe methods:

```text
POST
PUT
PATCH
DELETE
```

Usually you do not require CSRF tokens for:

```text
GET
HEAD
OPTIONS
```

But those methods must not change server state.

---

## 2. Use SameSite cookies

The `SameSite` cookie attribute controls whether cookies are sent on cross-site requests. MDN describes it as a partial CSRF defense and recommends treating it as defense-in-depth, not as the only protection. 

Example:

```http
Set-Cookie: SESSION=abc123; HttpOnly; Secure; SameSite=Lax
```

Common values:

```text
SameSite=Strict
```

Strongest protection. The cookie is not sent on cross-site requests. Good for highly sensitive apps, but it can break some login flows or cross-site navigation use cases.

```text
SameSite=Lax
```

Good default for many apps. Cookies are withheld from many cross-site subrequests and form posts, but may still be sent in some top-level navigations.

```text
SameSite=None; Secure
```

Allows cross-site cookie use. Required for some third-party or embedded scenarios, but dangerous if used carelessly. Must be paired with `Secure`.

A practical cookie setup:

```http
Set-Cookie: SESSION=abc123; HttpOnly; Secure; SameSite=Lax; Path=/
```

For very sensitive applications:

```http
Set-Cookie: SESSION=abc123; HttpOnly; Secure; SameSite=Strict; Path=/
```

MDN also recommends `Secure`, `HttpOnly`, and appropriate `SameSite` configuration for safer cookies. 

---

## 3. Do not mutate state with GET

Never do this:

```http
GET /delete-account
GET /transfer?to=attacker&amount=1000
GET /change-email?email=attacker@example.com
```

`GET` should be safe and idempotent from a user-action perspective. It should retrieve data, not perform sensitive changes.

Use:

```http
POST /transfer
DELETE /account
PATCH /account/email
```

And still protect those endpoints with CSRF checks.

---

## 4. Check `Origin` and sometimes `Referer`

For state-changing requests, the backend can verify that the request came from your own origin.

Example:

```http
Origin: https://app.example.com
```

Backend check:

```text
Allow if Origin is exactly https://app.example.com
Reject if Origin is missing or unexpected
```

This is especially useful for APIs.

However, `Origin`/`Referer` checks are usually considered defense-in-depth rather than the only CSRF defense, because some legitimate requests may omit headers depending on browser behavior, privacy settings, redirects, or older clients.

Good approach:

```text
CSRF token validation + SameSite cookies + Origin validation
```

---

## 5. Use custom headers for AJAX APIs

For JSON APIs used by your own frontend, you can require a custom header:

```http
X-CSRF-Token: ...
```

or even:

```http
X-Requested-With: XMLHttpRequest
```

A malicious plain HTML form cannot add arbitrary custom headers. A malicious `fetch()` from another origin would need CORS permission to send non-simple headers.

But this only works if your CORS policy is strict.

Bad CORS:

```http
Access-Control-Allow-Origin: https://evil.com
Access-Control-Allow-Credentials: true
```

Very bad dynamic CORS:

```java
response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
response.setHeader("Access-Control-Allow-Credentials", "true");
```

That effectively trusts any origin and can destroy the protection.

---

## 6. Configure CORS carefully

CORS should not be treated as your main CSRF defense, but a bad CORS config can make things worse.

For cookie-authenticated APIs, avoid:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```

Browsers reject that exact combination, but many apps implement dangerous origin reflection instead.

Better:

```http
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Credentials: true
```

Only allow trusted frontend origins.

---

## 7. Require re-authentication for critical actions

For sensitive actions, require extra confirmation:

```text
Change password
Add payment method
Transfer money
Delete account
Create API token
Change MFA settings
```

Examples:

```text
Re-enter password
Confirm with MFA
Confirm via email
Use WebAuthn/passkey confirmation
```

This does not replace CSRF protection, but it limits impact.

---

## 8. Protect against XSS too

CSRF tokens assume the attacker cannot read your page or steal the token.

If your site has XSS, an attacker may be able to read the CSRF token from the DOM or make valid same-origin requests from inside your app. OWASP warns that XSS can bypass CSRF mitigations. 

So you also need:

```text
Output encoding
Content Security Policy
Input validation
Avoiding unsafe innerHTML usage
HttpOnly cookies
Dependency hygiene
```

`HttpOnly` does not prevent CSRF, but it helps prevent JavaScript from stealing session cookies during XSS.

---

# Token patterns

## Synchronizer token pattern

Classic server-rendered approach:

1. User logs in.
2. Server creates a CSRF token and stores it in the session.
3. Server renders it into forms.

Example:

```html
<form method="POST" action="/change-email">
  <input type="hidden" name="_csrf" value="random-token-here" />
  <input name="email" />
  <button>Save</button>
</form>
```

Server validates:

```text
request._csrf == session.csrfToken
```

Good for traditional server-rendered apps.

---

## Double-submit cookie pattern

Common in SPAs:

1. Server sets a CSRF cookie.
2. Frontend reads that cookie.
3. Frontend sends the same value in a header.
4. Backend verifies that the cookie value and header value match.

Example:

```http
Cookie: XSRF-TOKEN=random-token
X-XSRF-TOKEN: random-token
```

This is used by some frameworks.

A stronger version signs the token server-side so attackers cannot forge meaningful values.

Important: the CSRF cookie must not be confused with the session cookie. The point is not that the token cookie is secret from the browser; the point is that an attacker’s cross-site form cannot read it and echo it into a custom header.

---

# Practical backend checklist

For a cookie-authenticated backend:

```text
Use SameSite=Lax or SameSite=Strict for session cookies.
Use Secure on cookies.
Use HttpOnly on session cookies.
Require CSRF tokens for POST, PUT, PATCH, DELETE.
Never mutate state through GET.
Validate Origin for sensitive state-changing requests.
Keep CORS strict.
Re-authenticate for very sensitive operations.
Prevent XSS.
```

Example cookie:

```http
Set-Cookie: SESSION=abc123; Path=/; HttpOnly; Secure; SameSite=Lax
```

Example protected request:

```http
POST /api/profile/email
Cookie: SESSION=abc123
Content-Type: application/json
X-CSRF-Token: 7d91f...

{
  "email": "new@example.com"
}
```

---

# Practical frontend checklist

For a frontend app:

```text
Fetch a CSRF token from the backend or read it from a non-HttpOnly CSRF cookie.
Send the token on every unsafe request.
Use credentials: "include" only when needed.
Do not rely on CORS alone.
Do not store session cookies manually in JavaScript.
Avoid XSS, because XSS can bypass CSRF defenses.
```

Example:

```js
async function updateEmail(email) {
  const csrfToken = getCookie("XSRF-TOKEN");

  const response = await fetch("/api/profile/email", {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken
    },
    body: JSON.stringify({ email })
  });

  if (!response.ok) {
    throw new Error("Failed to update email");
  }
}
```

---

# Spring Security example

Since you work with Java/Kotlin, this is the typical idea in Spring Security.

For a browser app using cookies, CSRF protection should usually be enabled:

```java
@Bean
SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf
            .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
        )
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/login", "/public/**").permitAll()
            .anyRequest().authenticated()
        )
        .build();
}
```

`CookieCsrfTokenRepository.withHttpOnlyFalse()` allows the frontend to read the CSRF token cookie and send it back in a header. The session cookie itself should still be `HttpOnly`.

For a pure stateless API that does **not** use cookies and only accepts bearer tokens in the `Authorization` header, CSRF is usually less relevant. In that case, disabling CSRF may be reasonable:

```java
.csrf(csrf -> csrf.disable())
```

But only if authentication is not cookie-based.

A useful rule:

```text
Cookie-based browser session? Keep CSRF protection.
Authorization header bearer token? CSRF is usually not the main risk.
```

---

# CSRF vs XSS

They are different:

| Attack | What attacker does                                | Main impact                                          |
| ------ | ------------------------------------------------- | ---------------------------------------------------- |
| CSRF   | Tricks browser into sending authenticated request | Performs actions as victim                           |
| XSS    | Runs attacker JavaScript inside your site         | Can steal data, tokens, perform actions, bypass CSRF |

CSRF abuses **ambient authority**: the browser automatically attaches cookies.

XSS abuses **code execution**: attacker JavaScript runs in your trusted origin.

---

# Simple mental model

A backend vulnerable to CSRF is basically saying:

> “This request has a valid session cookie, so it must be intentional.”

A CSRF-protected backend says:

> “This request has a valid session cookie, but I also need proof that it came from my own UI or an authorized client.”

That proof is usually a CSRF token, supported by `SameSite` cookies, strict CORS, safe HTTP methods, and optional `Origin` validation.