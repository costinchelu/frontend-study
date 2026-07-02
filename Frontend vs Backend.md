# **What a Frontend App Means Compared to a Backend App**

A frontend web app is code that is downloaded by the user’s browser and executed on the user’s machine.
 A backend app is code that runs on infrastructure controlled by you or your organization.

That difference affects almost everything: security, storage, performance, authentication, validation, deployment, and the responsibilities of each side.

------

# **1. The Big Picture**

A typical web application has at least two major parts:

```text
User's browser                     Server / Cloud
─────────────────                 ─────────────────────
Frontend app       HTTP calls      Backend app
HTML/CSS/JS  ───────────────────>  API endpoints
Angular/React/etc                 Business logic
Runs in browser                   Database access
                                  Secrets/configuration
                                  Authentication
                                  Integrations
```

The **frontend** is what the user interacts with: pages, forms, buttons, checkboxes, validation messages, modals, navigation, loading spinners, and so on.

The **backend** is what owns the trusted logic: users, permissions, database records, transactions, integrations, files, secrets, and authoritative business decisions.

A frontend app may look like “the application” from the user’s point of view, but technically it is only the client-side part of the system.

------

# **2. What Is a Frontend App?**

A frontend web app is usually made of:

```text
HTML       structure/content
CSS        styling/layout
JavaScript behavior/logic
```

When using Angular, the developer usually writes:

```text
TypeScript
Angular components
HTML templates
CSS/SCSS
Services
Routes
Forms
```

But the browser does not directly understand Angular TypeScript source code as you write it. During build time, Angular compiles and bundles the app into browser-readable files:

```text
index.html
main.js
styles.css
assets/*
```

Then these files are served to the browser.

The browser downloads them and executes them locally.

Example:

```text
1. User opens https://my-app.com
2. Browser downloads index.html
3. Browser downloads JavaScript bundle
4. Browser executes the frontend app
5. Angular starts rendering components
6. Frontend calls backend APIs when it needs data
```

So a frontend app is similar to a small application temporarily installed into the browser tab.

------

# **3. What Does “Runs on the User’s Machine” Mean?**

When you build an Angular app, the result is usually static files.

For example:

```text
dist/my-app/
  index.html
  main.abc123.js
  styles.def456.css
  assets/logo.svg
```

These files may be hosted by:

```text
Nginx
Apache
CloudFront
Azure Static Web Apps
S3 bucket
Firebase Hosting
A backend server
A CDN
```

But once the browser downloads them, the frontend code runs inside the browser on the user’s device.

The frontend is not continuously running on your server. Your server may only serve the frontend files and respond to API calls.

------

# **4. What Is a Backend App?**

A backend app is software running on a server environment controlled by the organization.

For example:

```text
Java Spring Boot app
Kotlin Ktor app
Node.js API
.NET API
Python FastAPI app
Go service
```

A backend app usually:

```text
Listens for HTTP requests
Validates input
Authenticates users
Checks authorization
Executes business logic
Reads/writes databases
Calls other services
Sends emails
Processes payments
Stores files
Manages secrets
Logs/audits operations
```

The backend is the authoritative side.

------

# **5. A Useful Mental Model**

For a backend developer, this is probably the cleanest mental model:

```text
Backend app = trusted service
Frontend app = untrusted client program
```

The frontend is like a mobile app, desktop app, Postman client, or curl script.

It can make requests to your backend, but it should not be trusted just because it was written by your team.

The user can inspect it, manipulate it, modify requests, delete local storage, disable JavaScript, change form values, call APIs manually, or use browser DevTools.

Therefore:

Frontend validation improves user experience.
 Backend validation enforces correctness and security.

------

# **6. Example: Same Feature, Frontend vs Backend Responsibilities**

Imagine a checkbox:

```text
"I accept the terms and conditions"
```

The frontend can:

```text
Display the checkbox
Remember whether it was checked in localStorage
Disable the Submit button until checked
Show a validation message
Send acceptTerms: true to backend
```

The backend must still:

```text
Check whether acceptTerms is true
Reject the request if it is false
Record acceptance if legally/business required
Associate acceptance with the user/session/time/version of terms
```

Why?

Because the user can bypass the frontend and send:

```http
POST /api/register
Content-Type: application/json

{
  "acceptTerms": false
}
```

or even omit the field completely.

So frontend validation is not security. It is convenience.

------

# **7. What an Angular App Actually Does**

An Angular app is usually structured around components.

Example:

```text
OtpComponent
LoginComponent
FooterComponent
HeaderComponent
TermsComponent
```

A component usually has:

```text
TypeScript file     behavior/state
HTML template       rendered view
CSS/SCSS file       styling
Spec file           unit tests
```

Example:

```ts
export class OtpComponent {
  phoneNumber = '';
  acceptTerms = false;

  submit(): void {
    // call backend
  }
}
```

Template:

```html
<input type="tel" [(ngModel)]="phoneNumber" />

<input type="checkbox" [(ngModel)]="acceptTerms" />

<button (click)="submit()">
  Submit
</button>
```

The TypeScript class is the component logic.
 The HTML template is the rendered UI.
 Angular binds the two together.

------

# **8. Frontend Is Event-Driven**

Backend developers often think in terms of request/response:

```text
Request comes in
Controller handles it
Service runs logic
Repository accesses DB
Response goes out
```

Frontend apps are more event-driven.

The user may:

```text
Click a button
Type in an input
Check a checkbox
Navigate to a route
Close a modal
Upload a file
Paste text
Resize the window
Lose network connection
Refresh the page
```

Each of these can trigger frontend logic.

Example:

```html
<button (click)="submitOtp()">Submit</button>
submitOtp(): void {
  this.http.post('/api/otp/verify', {
    code: this.form.value.code
  }).subscribe(response => {
    // update UI
  });
}
```

So a frontend app is constantly reacting to user actions and asynchronous events.

------

# **9. Frontend State vs Backend State**

This is one of the most important concepts.

## **Frontend State**

Frontend state exists in the browser.

Examples:

```text
Current page
Current form values
Checkbox checked/unchecked
Selected tab
Loading spinner visible/invisible
Modal open/closed
Client-side validation errors
Cached API response
Current logged-in user display name
```

Frontend state may live in:

```text
Component fields
Angular signals
RxJS observables
Services
NgRx/store
localStorage
sessionStorage
cookies
IndexedDB
```

But unless it is sent to the backend, it is not authoritative.

## **Backend State**

Backend state exists on the server/database side.

Examples:

```text
User account
Order record
Payment status
Permissions
Session
Audit logs
Terms acceptance record
OTP verification result
```

Backend state is usually persisted in:

```text
Database
Cache
Message queue
Object storage
Server-side session store
```

Backend state is authoritative.

------

# **10. Example: Checkbox Persistence**

Suppose you store checkbox state in `localStorage`:

```ts
localStorage.setItem('acceptTerms_session-123', 'true');
```

This means:

```text
The browser remembers the checkbox state for this device/browser/profile.
```

It does **not** mean:

```text
The backend knows the user accepted the terms.
```

It also does not mean:

```text
Another browser will know the checkbox was checked.
```

So this works:

```text
Same browser
Same device
Same localStorage
Same session id
```

But this does not work:

```text
Different browser
Different device
Private/incognito mode
User cleared browser data
Different browser profile
```

To make it persistent across devices, it must be stored server-side.

------

# **11. What Can a Frontend App Store Locally?**

The browser gives frontend apps some storage options.

## **Component Memory**

```ts
acceptTerms = true;
```

Lost when:

```text
Page refreshes
Tab closes
Component is destroyed
```

## **sessionStorage**

```ts
sessionStorage.setItem('key', 'value');
```

Usually survives refresh in the same tab/session, but not a full new browser session.

Good for temporary flow state.

## **localStorage**

```ts
localStorage.setItem('key', 'value');
```

Survives browser restart, but only on the same browser/device/profile.

Good for simple client preferences.

Not good for secrets.

## **Cookies**

Cookies are browser-managed and can be sent automatically with HTTP requests.

Commonly used for:

```text
Sessions
Authentication
CSRF protection
Tracking
Preferences
```

Cookies can be configured by the backend using `Set-Cookie`.

## **IndexedDB**

A larger browser database.

Used for:

```text
Offline apps
Large client-side cache
Complex local data
Progressive Web Apps
```

------

# **12. Important Limitation: Frontend Storage Is Not Secure**

A frontend app should not store sensitive secrets in localStorage.

Avoid storing:

```text
Client secrets
API keys that must be private
Database credentials
Long-lived auth tokens if avoidable
Encryption keys that protect server data
Private business rules
```

Why?

Because the user controls the browser.

They can open DevTools and inspect:

```text
JavaScript files
localStorage
sessionStorage
cookies, unless HttpOnly
network requests
HTML
CSS
source maps, if exposed
```

Even if JavaScript is minified, it can still be inspected and reverse-engineered.

A frontend app cannot keep secrets from the user.

------

# **13. Important Limitation: Frontend Code Is Public**

When you deploy a frontend app, the browser downloads the JavaScript bundle.

That means the user can inspect it.

So this is unsafe:

```ts
const secretApiKey = 'super-secret-key';
```

Anything inside the frontend bundle should be considered public.

This is very different from backend code.

Backend secrets can be stored in:

```text
Environment variables
Secret managers
Kubernetes secrets
Vault
AWS Secrets Manager
Azure Key Vault
GCP Secret Manager
```

Frontend code cannot safely contain private secrets.

------

# **14. Important Limitation: The Frontend Cannot Be Trusted**

A user can manipulate frontend behavior.

For example, the frontend may disable a button:

```html
<button [disabled]="form.invalid">
  Submit
</button>
```

But a user can still call the backend directly:

```bash
curl -X POST https://api.example.com/submit \
  -H "Content-Type: application/json" \
  -d '{"invalid":"data"}'
```

Or they can edit the DOM in DevTools and enable the button.

Therefore:

```text
Frontend validation = UX
Backend validation = security/integrity
```

The backend must validate everything again.

------

# **15. Frontend Networking Limitations**

A frontend app cannot freely call any server on the internet.

Browsers enforce a security model called the **Same-Origin Policy**.

This means a page loaded from:

```text
https://app.example.com
```

cannot freely read responses from:

```text
https://api.other-domain.com
```

unless that API explicitly allows it through CORS.

CORS means Cross-Origin Resource Sharing.

Example:

```text
Frontend origin:
https://app.example.com

Backend origin:
https://api.example.com
```

These are different origins because the host is different.

The backend/proxy may need to allow:

```http
Access-Control-Allow-Origin: https://app.example.com
```

If cookies are involved, it may also need:

```http
Access-Control-Allow-Credentials: true
```

and the frontend may need:

```ts
withCredentials: true
```

This is why frontend-backend integration often involves CORS issues that backend developers may not encounter when calling services from server to server.

------

# **16. Browser Sandbox Limitations**

A frontend app runs inside the browser sandbox.

It cannot freely:

```text
Read arbitrary files from the user's disk
Write arbitrary files to disk
Open arbitrary local programs
Access environment variables
Access private network resources freely
Read HttpOnly cookies
Bypass CORS
Open raw TCP sockets like a backend service
Use private server-side credentials
```

It can only use APIs exposed by the browser, often with user permission.

Examples:

```text
Camera access requires permission
Microphone access requires permission
Geolocation requires permission
File upload requires user selection
Clipboard access may require permission
Notifications require permission
```

This sandbox is a security feature.

------

# **17. Frontend Performance Constraints**

A backend app runs on controlled infrastructure.

You know more or less:

```text
CPU
RAM
network
runtime version
scaling model
deployment environment
```

A frontend app runs on many unknown environments:

```text
Old laptop
Modern desktop
Low-end Android phone
iPhone
Tablet
Slow browser
Corporate browser
Bad Wi-Fi
Mobile network
Ad blockers
Accessibility tools
Different screen sizes
Different zoom settings
```

So frontend performance is affected by:

```text
JavaScript bundle size
Rendering complexity
DOM size
Network latency
Images/assets
Device CPU
Browser performance
Memory leaks
Change detection
Number of API calls
```

A backend service might be optimized for throughput and latency.
 A frontend app must also be optimized for perceived user experience.

------

# **18. Frontend UX Responsibilities**

The frontend is responsible for how the user experiences the system.

That includes:

```text
Layout
Responsiveness
Accessibility
Form validation messages
Loading states
Error messages
Navigation
Focus handling
Keyboard support
Screen reader support
Internationalization
Mobile behavior
Visual consistency
```

For example, when calling a backend API, the frontend should consider:

```text
What happens while loading?
What happens if the request fails?
What happens if the user double-clicks Submit?
What happens if the user loses internet?
What happens if the session expires?
What happens if validation errors come back from backend?
```

Backend developers usually think about correctness and reliability.
 Frontend developers must think about correctness, reliability, and human interaction.

------

# **19. Request/Response Example**

Imagine an OTP page.

## **Frontend responsibilities**

```text
Render phone number input
Restrict input to numeric characters
Render OTP input
Render Submit button
Show loading spinner
Disable button while submitting
Show validation errors
Call backend/Heracles
React to success/failure
Navigate to next page
```

## **Backend responsibilities**

```text
Generate OTP
Send OTP through SMS/email
Store OTP challenge
Rate limit attempts
Validate submitted OTP
Expire OTP after time limit
Prevent brute force
Audit attempts
Return success/failure
```

The frontend may check:

```text
OTP must be 6 digits
```

But the backend must still verify:

```text
Is this OTP valid?
Is it expired?
Does it belong to this session?
Was it already used?
Were there too many attempts?
```

------

# **20. Example Angular API Call**

Frontend code:

```ts
this.http.post('/api/otp/verify', {
  sessionId: this.sessionId,
  otpCode: this.form.value.otpCode
}).subscribe({
  next: response => {
    this.router.navigate(['/success']);
  },
  error: error => {
    this.errorMessage = 'Invalid OTP code';
  }
});
```

This code runs in the browser.

The backend receives:

```http
POST /api/otp/verify
Content-Type: application/json

{
  "sessionId": "abc123",
  "otpCode": "123456"
}
```

The backend should not assume the frontend sent valid data.

It must validate everything.

------

# **21. Frontend Routing vs Backend Routing**

This can be confusing.

## **Backend Routing**

Backend route:

```text
GET /api/users/123
```

Handled by a server controller:

```java
@GetMapping("/api/users/{id}")
public User getUser(@PathVariable String id) {
    ...
}
```

## **Frontend Routing**

Angular route:

```text
/otp
/success
/profile
/settings
```

Handled inside the browser by Angular Router.

Example:

```ts
const routes = [
  { path: 'otp', component: OtpComponent },
  { path: 'success', component: SuccessComponent }
];
```

When the user navigates from:

```text
/otp
```

to:

```text
/success
```

Angular may not reload the whole page. It may just replace the visible component inside the browser.

This is why Angular apps are often called SPAs: Single Page Applications.

------

# **22. What Is a Single Page Application?**

A Single Page Application, or SPA, is a frontend app where the browser initially loads one main HTML page, then JavaScript handles navigation and rendering.

Initial load:

```text
GET /index.html
GET /main.js
GET /styles.css
```

Then Angular takes over.

Navigation may happen client-side:

```text
/otp -> /success -> /profile
```

without fully reloading the page from the server.

When the SPA needs data, it calls APIs:

```text
GET /api/profile
POST /api/otp/verify
```

This differs from traditional server-rendered apps, where the server returns a new full HTML page for each route.

------

# **23. Frontend Build-Time vs Runtime**

Angular development involves a build step.

Source code:

```text
src/app/otp/otp.component.ts
src/app/otp/otp.component.html
src/app/otp/otp.component.scss
```

Build output:

```text
dist/app/index.html
dist/app/main.js
dist/app/styles.css
```

Important distinction:

## **Build-time**

Happens on developer machine or CI/CD.

```text
TypeScript compilation
Angular compilation
Bundling
Minification
Environment replacement
Asset processing
```

## **Runtime**

Happens in the user’s browser.

```text
JavaScript executes
Components render
Events happen
HTTP calls are made
State changes
```

A backend developer may be used to deploying compiled JVM bytecode to a server.
 With frontend apps, the compiled JavaScript is delivered to every user’s browser.

------

# **24. Deployment Difference**

## **Backend deployment**

You deploy an application to a runtime environment:

```text
Java process
Docker container
Kubernetes pod
VM
Serverless function
```

It stays running and waits for requests.

## **Frontend deployment**

You usually deploy static files:

```text
index.html
main.js
styles.css
assets/*
```

These files are downloaded by browsers.

The frontend app does not “run on the hosting server” in the same way a backend app runs. The hosting server mostly serves files.

Of course, there are exceptions: server-side rendering, Node-based frontend servers, edge rendering, etc. But for a typical Angular SPA, the built app is static assets.

------

# **25. Security Boundary**

This is one of the most important parts of the lesson.

The backend is inside your trust boundary.

```text
Trusted:
Backend services
Databases
Internal queues
Private APIs
Secret managers
```

The frontend is outside your trust boundary.

```text
Untrusted:
Browser
JavaScript bundle
localStorage
sessionStorage
User-modifiable form data
Client-side route guards
Client-side validation
```

This means:

```text
Never trust frontend input
Never put private secrets in frontend code
Never enforce authorization only in frontend
Never rely only on hidden buttons or disabled fields
Never assume localStorage values are correct
```

Frontend can help guide the user, but backend must enforce the rules.

------

# **26. Authentication: Frontend vs Backend View**

Authentication often involves both sides.

## **Cookie/session-based auth**

Flow:

```text
1. User logs in
2. Backend/identity provider sets cookie
3. Browser stores cookie
4. Browser sends cookie on future requests
5. Backend validates session
```

Frontend may need:

```ts
withCredentials: true
```

especially when calling a different origin and cookies are involved.

The frontend may not be able to read the cookie if it is `HttpOnly`, which is often good.

## **Token-based auth**

Flow:

```text
1. User logs in
2. Frontend receives token
3. Frontend sends token in Authorization header
4. Backend validates token
```

Example:

```ts
headers: {
  Authorization: `Bearer ${token}`
}
```

Frontend can use tokens, but storing them securely is a serious topic.

## **Key point**

The frontend may help initiate login and store/display auth state, but the backend decides whether a request is authenticated and authorized.

------

# **27. Authorization Must Not Be Frontend-Only**

Suppose a frontend hides an Admin button:

```html
<button *ngIf="user.role === 'ADMIN'">
  Delete user
</button>
```

That is good UX.

But this is not security.

The backend must still enforce:

```text
Only admins can call DELETE /api/users/{id}
```

Because a non-admin user can manually call:

```bash
curl -X DELETE https://api.example.com/api/users/123
```

So:

```text
Frontend authorization = what the user sees
Backend authorization = what the user can actually do
```

------

# **28. Environment Configuration**

Backend apps often have environment variables:

```text
DB_URL
DB_PASSWORD
CLIENT_SECRET
JWT_SIGNING_KEY
```

Frontend apps may also have “environment” files:

```ts
export const environment = {
  apiBaseUrl: 'https://api.example.com'
};
```

But frontend environment values are bundled into JavaScript and sent to the browser.

So frontend environment config is not secret.

Safe frontend config:

```text
API base URL
Feature flag names, if not sensitive
Public analytics ID
Public OAuth client ID, depending on flow
```

Unsafe frontend config:

```text
Database password
Private API key
OAuth client secret
JWT signing secret
Internal service credentials
```

------

# **29. Why Frontend Apps Need Backend APIs**

An exclusively client-side app can do only what the browser allows.

It can:

```text
Render UI
Collect input
Validate basic input
Store simple local state
Call public APIs
Use browser APIs
Cache data locally
Work offline to some extent
```

It cannot safely:

```text
Store shared authoritative data
Protect secrets
Access databases directly
Guarantee business rules
Authenticate users by itself
Perform trusted authorization
Execute privileged operations
Send secret credentials to third-party systems
Prevent user tampering
```

So most serious apps need backend APIs.

------

# **30. What Can an Exclusively Client-Side App Do?**

An exclusively client-side app can be useful.

Examples:

```text
Calculator
Markdown editor
Unit converter
Simple drawing tool
Static documentation site
Local todo list
Offline note-taking app
Frontend-only prototype
Game running in browser
```

It can store data locally using:

```text
localStorage
IndexedDB
File downloads
Browser cache
```

But data is local to that browser/device unless synchronized with a backend.

So an exclusively client-side app is good when:

```text
No sensitive data is needed
No shared state is needed
No trusted server-side validation is needed
No private integrations are needed
Data can stay local
```

------

# **31. Limitations of an Exclusively Client-Side App**

## **No shared database**

Without a backend, data cannot naturally be shared across users/devices.

For example:

```text
User checks a checkbox in Chrome on laptop
User opens Safari on phone
State is not there
```

Because the state was stored locally in Chrome.

## **No private secrets**

Any secret inside frontend code can be inspected.

## **No trusted validation**

Users can modify requests or local state.

## **No secure authorization**

Frontend can hide UI, but cannot enforce access to real resources without backend support.

## **Limited storage**

Browser storage is limited and can be cleared.

## **Browser restrictions**

CORS, sandboxing, permissions, and network restrictions apply.

## **No reliable background execution**

A browser tab may be closed, suspended, throttled, or killed.

## **Device variability**

The app runs on unknown devices with different performance and browser support.

------

# **32. Backend Advantages**

A backend app can:

```text
Run in controlled infrastructure
Use private credentials
Access databases securely
Enforce validation
Enforce authorization
Integrate with internal systems
Perform scheduled jobs
Process background tasks
Store durable shared data
Log/audit reliably
Scale horizontally
Use queues and workers
```

A backend is better for:

```text
Business rules
Security
Persistence
Integration
Coordination between users
Long-running processing
Sensitive operations
```

------

# **33. Frontend Advantages**

A frontend app can:

```text
Provide immediate interaction
Reduce server load for UI rendering
Validate input before sending requests
Cache data locally
Work partially offline
Provide rich user experiences
Use browser capabilities
Render responsive interfaces
```

A frontend is better for:

```text
User interaction
Presentation
Form behavior
Client-side navigation
Immediate feedback
Accessibility
Visual state
Local user preferences
```

------

# **34. Typical Division of Responsibility**

| **Concern**                        | **Frontend**             | **Backend**              |
| ---------------------------------- | ------------------------ | ------------------------ |
| Page layout                        | Yes                      | Usually no               |
| Form input                         | Yes                      | Receives final data      |
| Basic validation                   | Yes, for UX              | Yes, for correctness     |
| Business validation                | Maybe duplicate for UX   | Yes, authoritative       |
| Authentication UI                  | Yes                      | Yes, actual verification |
| Authorization                      | Hide/show UI             | Enforce permissions      |
| Secrets                            | No                       | Yes                      |
| Database access                    | No direct access         | Yes                      |
| Shared persistence                 | No, unless API-backed    | Yes                      |
| Local preferences                  | Yes                      | Maybe                    |
| Audit logging                      | Maybe client events      | Yes                      |
| Long-running jobs                  | No                       | Yes                      |
| Integration with internal services | No direct trusted access | Yes                      |

------

# **35. Example: Registration Flow**

Frontend:

```text
Render registration form
Validate required fields
Check password confirmation matches
Show password strength
Disable submit button while invalid
Call POST /api/register
Display success/error message
Navigate user after success
```

Backend:

```text
Validate all fields again
Hash password
Check duplicate email
Create user record
Send confirmation email
Create audit log
Return response
```

Even if the frontend has perfect validation, the backend still repeats critical validation.

------

# **36. Example: Payment Flow**

Frontend:

```text
Display cart
Collect payment details through secure provider UI
Show total price
Call backend to create payment intent
Show payment success/failure
```

Backend:

```text
Calculate authoritative price
Create payment intent with payment provider
Use secret API keys
Verify payment webhook
Mark order as paid
Prevent tampering
```

The frontend must never calculate the final price in a trusted way.

A user could modify:

```json
{
  "productId": "123",
  "price": 1
}
```

The backend must calculate the price itself.

------

# **37. API Contracts**

Frontend and backend communicate through API contracts.

Example response:

```json
{
  "sessionId": "abc123",
  "expiresInSeconds": 300,
  "maskedPhoneNumber": "+40******123"
}
```

The frontend needs to know:

```text
Endpoint URL
HTTP method
Request body shape
Response body shape
Possible error responses
Authentication requirements
CORS/credentials behavior
Validation rules
```

Backend developers often expose APIs.
 Frontend developers depend heavily on clear API contracts.

Good API contracts reduce frontend/backend confusion.

------

# **38. Error Handling Differences**

A backend error may be technically precise:

```json
{
  "code": "OTP_EXPIRED",
  "message": "OTP challenge expired"
}
```

The frontend must translate this into a user experience:

```text
Your code has expired. Please request a new one.
```

Frontend must consider:

```text
Should the user retry?
Should the form reset?
Should the Submit button be re-enabled?
Should focus move to an error message?
Should the user be redirected?
```

Backend returns facts.
 Frontend turns them into human interaction.

------

# **39. Frontend Testing vs Backend Testing**

Backend tests often focus on:

```text
Services
Controllers
Repositories
Database behavior
Security rules
API contracts
Integration tests
```

Frontend tests often focus on:

```text
Component rendering
Template bindings
User interactions
Form validation
Button enabled/disabled state
Service calls
Routing
State changes
DOM attributes
Accessibility attributes
```

Example frontend unit test:

```ts
it('should disable submit button when form is invalid', () => {
  fixture.detectChanges();

  const button = fixture.nativeElement.querySelector('button');

  expect(button.disabled).toBeTrue();
});
```

Frontend tests often interact with rendered HTML, not just class methods.

------

# **40. Why Browser DevTools Matter**

Frontend development heavily uses browser DevTools.

Important tabs:

```text
Elements      Inspect HTML/CSS
Console       Logs/errors
Network       API calls, headers, payloads
Application   localStorage, sessionStorage, cookies
Sources       JavaScript debugging
Performance   Rendering/performance analysis
Lighthouse    Accessibility/performance checks
```

For backend developers, the Network tab is especially useful because it shows:

```text
Request URL
Method
Status code
Request headers
Response headers
Payload
Cookies
CORS errors
Timing
```

This is often the fastest way to debug frontend-backend integration.

------

# **41. How a Page Load Works**

For an Angular SPA:

```text
1. User enters https://app.example.com/otp
2. Server returns index.html
3. Browser downloads JavaScript and CSS
4. Angular starts
5. Angular Router decides OtpComponent should render
6. OtpComponent initializes
7. Component reads route params/query params/localStorage
8. Component may call backend API
9. Browser updates UI
```

Important: after Angular starts, many route changes may happen without a full server page reload.

------

# **42. The Frontend Is Stateful, but Fragile**

Frontend state can disappear when:

```text
User refreshes page
User closes tab
Browser kills tab
Component is destroyed
Route changes
User clears site data
Incognito window closes
App version updates
JavaScript error breaks execution
```

So frontend state should be treated carefully.

For important state:

```text
Persist to backend
or use URL state
or use localStorage/sessionStorage with known limitations
```

------

# **43. URL as State**

The URL can carry state.

Examples:

```text
/otp?id=abc123
/products?page=2&sort=price
/users/123
```

URL state is useful because:

```text
It survives refresh
It can be bookmarked
It can be shared
It works across tabs
It helps deep linking
```

But URLs should not contain sensitive secrets.

Good URL state:

```text
Page number
Filter
Sort
Resource id
Session reference id, depending on security model
```

Bad URL state:

```text
Password
Raw token
Secret key
Private personal data
```

------

# **44. Cookies, localStorage, and sessionStorage**

A common source of confusion:

## **localStorage**

```text
Controlled by JavaScript
Not sent automatically to backend
Survives browser restart
Readable by frontend JavaScript
Not suitable for secrets
```

## **sessionStorage**

```text
Controlled by JavaScript
Not sent automatically to backend
Usually scoped to tab/session
Cleared when session ends
Readable by frontend JavaScript
```

## **Cookies**

```text
Managed by browser
Can be sent automatically with HTTP requests
Can be set by backend
Can be HttpOnly so JavaScript cannot read them
Can have expiration, SameSite, Secure flags
Often used for auth/session
```

Cookies are closer to HTTP behavior.
 localStorage/sessionStorage are closer to client-side app memory persistence.

------

# **45. Why** **`withCredentials`** **Exists**

When frontend and backend/proxy are on different origins, cookies are not always sent automatically.

Example:

```text
Frontend:
https://app.example.com

API/Proxy:
https://api.example.com
```

If the API uses cookies, Angular may need:

```ts
this.http.get('/api/me', {
  withCredentials: true
});
```

This tells the browser to include credentials like cookies.

But this only works if the server/proxy allows credentialed CORS.

So `withCredentials` is not a generic auth solution. It is specifically relevant to browser-managed credentials such as cookies.

------

# **46. Frontend Cannot Directly Access a Database**

A frontend should not connect directly to a production database.

Bad idea:

```text
Angular app -> PostgreSQL
```

Why?

```text
Database credentials would be exposed
No trusted authorization layer
No business validation
No audit control
No protection against malicious clients
```

Correct architecture:

```text
Angular app -> Backend API -> Database
```

The backend protects the database and controls operations.

------

# **47. Frontend Cannot Safely Call Private Third-Party APIs with Secrets**

Suppose you have a private API key:

```text
PAYMENT_PROVIDER_SECRET_KEY
```

This must not be in Angular code.

Bad:

```ts
const secretKey = 'sk_live_...';
```

Correct:

```text
Angular -> Your backend -> Payment provider
```

The backend uses the secret key server-side.

------

# **48. Frontend and Backend Versioning**

Frontend and backend are often deployed separately.

Potential issue:

```text
Frontend version 1 expects field: phoneNumber
Backend version 2 renamed it to: mobileNumber
```

This breaks the app.

Therefore API compatibility matters.

Good practices:

```text
Version APIs when needed
Avoid breaking response shapes casually
Use typed contracts where possible
Coordinate deployments
Handle optional fields safely
Use backward-compatible changes
```

------

# **49. Frontend Caching**

Frontend apps can cache data in several ways:

```text
In-memory component/service state
HTTP cache
localStorage
sessionStorage
IndexedDB
Service workers
Angular state stores
```

Caching improves UX and performance, but creates consistency problems.

Questions to ask:

```text
How fresh must the data be?
Can stale data be shown?
When should cache be invalidated?
What happens after logout?
What happens when user changes account?
```

Backend developers face caching too, but frontend caching is closer to user-visible behavior.

------

# **50. Accessibility Is a Frontend Responsibility**

Frontend apps must be usable by people using:

```text
Keyboard navigation
Screen readers
High contrast mode
Zoom
Reduced motion settings
Assistive technologies
```

Examples:

```html
<a aria-label="Privacy Notice (opens in new tab)">
  Privacy Notice
</a>
```

Accessibility is not just “nice to have”; for many systems it is a requirement.

Backend developers may not encounter this area often, but it is central to frontend quality.

------

# **51. Responsive Design**

Frontend code must work across screen sizes.

Example:

```text
Desktop monitor
Laptop
Tablet
Phone
Split-screen view
Zoomed browser
```

This involves:

```text
CSS media queries
Flexible layouts
Responsive components
Touch-friendly controls
Different navigation patterns
```

Backend APIs are usually screen-size independent.
 Frontend UI is not.

------

# **52. Frontend Failure Modes**

Frontend apps fail differently from backend apps.

Common frontend failures:

```text
JavaScript runtime error
API CORS error
Network timeout
Browser compatibility issue
Cookie not sent
localStorage blocked
Ad blocker blocks script/request
User has old cached bundle
Slow device freezes UI
CSS layout breaks
Screen reader cannot understand page
```

Backend monitoring alone may not show all frontend failures.

Frontend apps often need:

```text
Client-side logging
Error tracking
Real user monitoring
Performance metrics
Analytics
```

------

# **53. Browser Compatibility**

Backend apps run on known runtimes:

```text
Java 21
Kotlin JVM
Node 20
.NET 8
```

Frontend apps run across browsers:

```text
Chrome
Edge
Firefox
Safari
Mobile Safari
Samsung Internet
Corporate-managed browsers
```

Different browsers may support different APIs or have different quirks.

Build tools and polyfills help, but browser compatibility remains a frontend concern.

------

# **54. Backend Developer Analogy**

A frontend app is like giving every user a small client application that talks to your backend API.

Think of it as similar to:

```text
A mobile app
A desktop app
A CLI client
Postman collection
```

But delivered through the browser.

The backend should treat it like any other external client.

That means:

```text
Authenticate requests
Authorize actions
Validate inputs
Rate limit sensitive operations
Avoid trusting client-side state
Return clear errors
Keep secrets server-side
```

------

# **55. Summary Diagram**

```text
                            ┌──────────────────────────┐
                            │      User's Browser       │
                            │                          │
                            │  Angular Frontend App     │
                            │  - Components             │
                            │  - Forms                  │
                            │  - UI state               │
                            │  - localStorage           │
                            │  - API calls              │
                            └─────────────┬────────────┘
                                          │ HTTP/HTTPS
                                          │ JSON
                                          ▼
                            ┌──────────────────────────┐
                            │    Backend / Proxy        │
                            │                          │
                            │  - Authentication         │
                            │  - Authorization          │
                            │  - Business logic         │
                            │  - Validation             │
                            │  - Secrets                │
                            │  - Database access        │
                            └─────────────┬────────────┘
                                          │
                                          ▼
                            ┌──────────────────────────┐
                            │        Database           │
                            │  Durable shared state     │
                            └──────────────────────────┘
```

------

# **56. Key Takeaways**

The frontend is code delivered to and executed by the user’s browser.

The backend is code running on trusted infrastructure controlled by the organization.

The frontend is responsible for interaction, rendering, user experience, local state, and calling APIs.

The backend is responsible for trust, persistence, secrets, business rules, authentication, authorization, and database access.

A frontend app can store data locally, but local browser storage is not shared across devices and should not be treated as secure or authoritative.

The frontend cannot be trusted. Users can inspect and manipulate frontend code, local storage, forms, and network requests.

A serious application usually needs both: frontend for user experience and backend for trusted operations.

A good rule is:

```text
Frontend decides how things look and feel.
Backend decides what is allowed and what is true.
```