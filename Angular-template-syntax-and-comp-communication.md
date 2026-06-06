Here’s a practical Angular refresher on template syntax and component communication.

# 1. Interpolation — `{{ }}`

Used to DISPLAY values from the TS component into HTML.

TS:

```ts
title = 'OTP Page';
```

HTML:

```html
<h1>{{ title }}</h1>
```

Result:

```html
<h1>OTP Page</h1>
```

You can also use expressions:

```html
<p>{{ 2 + 2 }}</p>
<p>{{ user.firstName }}</p>
```

But avoid heavy logic in templates.

---

# 2. Property Binding — `[ ]`

Used to SEND data from TS → HTML element/property.

TS:

```ts
isDisabled = true;
imageUrl = 'logo.png';
```

HTML:

```html
<button [disabled]="isDisabled">Save</button>

<img [src]="imageUrl">
```

Equivalent DOM behavior:

```ts
button.disabled = true;
img.src = 'logo.png';
```

---

# 3. Event Binding — `( )`

Used to SEND events from HTML → TS.

HTML:

```html
<button (click)="save()">Save</button>

<input (input)="onInput($event)">
```

TS:

```ts
save(): void {
  console.log('saved');
}

onInput(event: Event): void {
  console.log(event);
}
```

---

# 4. Two-Way Binding — `[( )]`

Combination of:

* property binding
* event binding

Commonly used with forms.

HTML:

```html
<input [(ngModel)]="username">
```

Equivalent to:

```html
<input
  [ngModel]="username"
  (ngModelChange)="username = $event">
```

TS:

```ts
username = 'Costin';
```

Typing updates TS automatically.

Requires:

```ts
FormsModule
```

---

# 5. Attribute Binding — `[attr.xxx]`

Used for HTML attributes that are not DOM properties.

Example:

```html
<a [attr.aria-label]="label"></a>
```

TS:

```ts
label = 'Privacy Notice';
```

Result:

```html
<a aria-label="Privacy Notice"></a>
```

Common for:

* aria-label
* colspan
* data-* attributes

---

# 6. Class Binding

```html
<div [class.active]="isActive"></div>
```

TS:

```ts
isActive = true;
```

Result:

```html
<div class="active"></div>
```

Multiple classes:

```html
<div [ngClass]="{ active: isActive, disabled: isDisabled }"></div>
```

---

# 7. Style Binding

```html
<div [style.color]="textColor"></div>
```

TS:

```ts
textColor = 'red';
```

---

# 8. Structural Directives

They modify the DOM structure.

## `@if`

```html
@if (isLoggedIn) {
 <div>Welcome</div>
} @else {
  <div>Access denied</div>
}
  

```

## `@for`

```html
<ul id="users-table">
  @for (user of users; track user.id) {
    <li>
      <app-user [user]="user" (select)="onSelectedUser($event)" />
    </li>
  }
</ul>
```

TS:

```ts
users = [
  { name: 'John' },
  { name: 'Ana' }
];
```

---

# 9. Template Reference Variables — `#`

HTML:

```html
<input #phoneInput>

<button (click)="log(phoneInput.value)">
  Log
</button>
```

TS:

```ts
log(value: string): void {
  console.log(value);
}
```

---

# 10. Safe Navigation Operator — `?.`

Prevents null/undefined crashes.

```html
<p>{{ user?.name }}</p>
```

Without it:

```ts
user.name
```

could crash if `user` is undefined.

---

# Component Communication

# Parent → Child (`@Input`)

Parent sends data down.

## Child component

```ts
@Input() title = '';
```

## Parent HTML

```html
<app-child [title]="pageTitle"></app-child>
```

Parent TS:

```ts
pageTitle = 'OTP Verification';
```

---

# Child → Parent (`@Output`)

Child emits events upward.

## Child TS

```ts
@Output() submitted = new EventEmitter<string>();

submit(): void {
  this.submitted.emit('123456');
}
```

## Parent HTML

```html
<app-child (submitted)="onSubmitted($event)"></app-child>
```

## Parent TS

```ts
onSubmitted(code: string): void {
  console.log(code);
}
```

---

# Sibling Components

Usually communicate through:

* parent component
* shared service

Example:

```text
Sibling A -> Service -> Sibling B
```

---

# Shared Service Communication

Very common in Angular.

Service:

```ts
@Injectable({ providedIn: 'root' })
export class UserService {

  private userSubject = new BehaviorSubject<string>('');

  user$ = this.userSubject.asObservable();

  setUser(name: string): void {
    this.userSubject.next(name);
  }
}
```

Component A:

```ts
this.userService.setUser('Costin');
```

Component B:

```ts
this.userService.user$.subscribe(user => {
  console.log(user);
});
```

---

# Quick Cheat Sheet

| Syntax        | Direction      | Purpose            |
| ------------- | -------------- | ------------------ |
| `{{ value }}` | TS → HTML      | display            |
| `[property]`  | TS → HTML      | set property       |
| `(event)`     | HTML → TS      | listen event       |
| `[(ngModel)]` | both           | two-way binding    |
| `[attr.xxx]`  | TS → HTML      | HTML attributes    |
| `*ngIf`       | structure      | conditional render |
| `*ngFor`      | structure      | loops              |
| `@Input()`    | parent → child | pass data          |
| `@Output()`   | child → parent | emit events        |
