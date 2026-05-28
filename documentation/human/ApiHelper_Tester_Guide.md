# ApiHelper Tester Guide

## What is `ApiHelper`?

`ApiHelper` is a small wrapper around Playwright's `APIRequestContext`.

It helps you write API tests in a cleaner way.

Instead of this:

```ts
const response = await request.post('/users', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
  data: payload,
});

expect(response.status()).toBe(201);
```

You can write this:

```ts
const user = await api.request
  .path('/users')
  .bearerToken(token)
  .body(payload)
  .expectStatus(201)
  .postJson<UserResponse>();
```

---

## Basic usage

```ts
const response = await api.request
  .path('/users')
  .expectStatus(200)
  .get();
```

With bearer token:

```ts
const response = await api.request
  .path('/users')
  .bearerToken(token)
  .expectStatus(200)
  .get();
```

With JSON response:

```ts
const user = await api.request
  .path('/users/123')
  .bearerToken(token)
  .expectStatus(200)
  .getJson<UserResponse>();
```

---

## Main methods

### Request setup

```ts
.path('/endpoint')
.bearerToken(token)
.header('name', 'value')
.headers({ name: 'value' })
.query({ page: 1 })
.body(payload)
.form(formPayload)
.expectStatus(200)
```

### Send request and get raw response

```ts
.get()
.post()
.put()
.patch()
.delete()
```

These return Playwright's `APIResponse`.

### Send request and get JSON body

```ts
.getJson<T>()
.postJson<T>()
.putJson<T>()
.patchJson<T>()
.deleteJson<T>()
```

These return the parsed response body.

---

## GET example

```ts
const response = await api.request
  .path('/users')
  .bearerToken(token)
  .query({
    page: 1,
    size: 20,
  })
  .expectStatus(200)
  .get();

const body = await response.json();
```

Or directly as JSON:

```ts
type UsersResponse = {
  data: {
    id: string;
    name: string;
    email: string;
  }[];
};

const users = await api.request
  .path('/users')
  .bearerToken(token)
  .query({
    page: 1,
    size: 20,
  })
  .expectStatus(200)
  .getJson<UsersResponse>();

expect(users.data.length).toBeGreaterThan(0);
```

---

## POST example

```ts
type CreateUserRequest = {
  name: string;
  email: string;
  role: string;
};

type UserResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const payload: CreateUserRequest = {
  name: 'John Doe',
  email: `john.${Date.now()}@test.com`,
  role: 'admin',
};

const user = await api.request
  .path('/users')
  .bearerToken(token)
  .body(payload)
  .expectStatus(201)
  .postJson<UserResponse>();

expect(user.id).toBeDefined();
expect(user.name).toBe(payload.name);
```

---

## PUT example

```ts
const updatedUser = await api.request
  .path(`/users/${userId}`)
  .bearerToken(token)
  .body({
    name: 'Updated Name',
  })
  .expectStatus(200)
  .putJson<UserResponse>();

expect(updatedUser.name).toBe('Updated Name');
```

---

## PATCH example

```ts
const updatedUser = await api.request
  .path(`/users/${userId}`)
  .bearerToken(token)
  .body({
    role: 'manager',
  })
  .expectStatus(200)
  .patchJson<UserResponse>();

expect(updatedUser.role).toBe('manager');
```

---

## DELETE example

Most DELETE endpoints return `204 No Content`.

Use `.delete()`:

```ts
await api.request
  .path(`/users/${userId}`)
  .bearerToken(token)
  .expectStatus(204)
  .delete();
```

Use `.deleteJson<T>()` only if the DELETE endpoint returns a JSON body.

---

## Form data example

Use `.form()` when the endpoint expects form data.

```ts
const response = await api.request
  .path('/login')
  .form({
    username: 'demo-user',
    password: 'demo-password',
  })
  .expectStatus(200)
  .post();

expect(response.ok()).toBeTruthy();
```

Do not use `.body()` and `.form()` in the same request.

---

## Status validation

Use `.expectStatus()` when you know the expected status.

```ts
await api.request
  .path('/users')
  .expectStatus(200)
  .get();
```

If the status is wrong, the helper throws an error with useful details:

```txt
Unexpected API response status.
Request: GET /users
Expected: 200
Actual: 401
Body: {"message":"Unauthorized"}
```

---

## Raw response vs JSON response

Use raw response methods when you need status, headers, or manual parsing:

```ts
const response = await api.request
  .path('/users')
  .expectStatus(200)
  .get();

expect(response.status()).toBe(200);

const body = await response.json();
```

Use JSON methods when you only need the response body:

```ts
const user = await api.request
  .path('/users/123')
  .expectStatus(200)
  .getJson<UserResponse>();

expect(user.id).toBe('123');
```

---

## Recommended service usage

For repeated flows, create service methods.

Example:

```ts
export class UsersApiService {
  constructor(private readonly api: ApiHelper) {}

  async createUser(payload: CreateUserRequest, token: string): Promise<UserResponse> {
    return this.api.request
      .path('/users')
      .bearerToken(token)
      .body(payload)
      .expectStatus(201)
      .postJson<UserResponse>();
  }

  async deleteUser(userId: string, token: string): Promise<void> {
    await this.api.request
      .path(`/users/${userId}`)
      .bearerToken(token)
      .expectStatus(204)
      .delete();
  }
}
```

Then the test is simple:

```ts
const user = await usersApi.createUser(payload, token);

expect(user.id).toBeDefined();

await usersApi.deleteUser(user.id, token);
```

---

## Fixture example

You can expose `ApiHelper` as a Playwright fixture.

```ts
import { test as base } from '@playwright/test';
import { ApiHelper } from '../helpers/ApiHelper';
import { UsersApiService } from '../services/UsersApiService';

type ApiFixtures = {
  api: ApiHelper;
  usersApi: UsersApiService;
};

export const test = base.extend<ApiFixtures>({
  api: async ({ request }, use) => {
    await use(new ApiHelper(request));
  },

  usersApi: async ({ api }, use) => {
    await use(new UsersApiService(api));
  },
});

export { expect } from '@playwright/test';
```

Then import from your fixture file:

```ts
import { test, expect } from '../../fixtures/apiFixtures';
```

Example test:

```ts
test('should create user', async ({ usersApi }) => {
  const user = await usersApi.createUser(payload, token);

  expect(user.id).toBeDefined();
});
```

---

## Logging

Enable API logs with:

```bash
LOG_API=true npx playwright test
```

Example log:

```txt
[API LOG] POST /users → 201
```

---

## Good practices

Use service methods for repeated API actions:

```ts
const user = await usersApi.createUser(payload, token);
```

Use direct `api.request` for one-off requests:

```ts
const response = await api.request
  .path('/health')
  .expectStatus(200)
  .get();
```

Keep `ApiHelper` generic. Do not add domain methods like `createUser()` directly inside it.

Put domain-specific methods in services:

```ts
usersApi.createUser()
authApi.login()
ordersApi.createOrder()
```

Use `.expectStatus()` when possible.

Use `.delete()` for `204 No Content`.

Use `.body()` for JSON payloads.

Use `.form()` for form data.

---

## Common mistakes

### Missing `.path()`

Incorrect:

```ts
await api.request
  .expectStatus(200)
  .get();
```

Correct:

```ts
await api.request
  .path('/users')
  .expectStatus(200)
  .get();
```

### Parsing JSON from 204 response

Incorrect:

```ts
await api.request
  .path('/users/123')
  .expectStatus(204)
  .deleteJson<UserResponse>();
```

Correct:

```ts
await api.request
  .path('/users/123')
  .expectStatus(204)
  .delete();
```

### Mixing body and form

Avoid:

```ts
await api.request
  .body(payload)
  .form(formPayload)
  .post();
```

Use only one:

```ts
await api.request
  .body(payload)
  .post();
```

or:

```ts
await api.request
  .form(formPayload)
  .post();
```

---

## Summary

Use `ApiHelper` for clean API requests.

Use service classes for repeated business flows.

Typical direct usage:

```ts
const response = await api.request
  .path('/users')
  .bearerToken(token)
  .expectStatus(200)
  .get();
```

Typical service usage:

```ts
const user = await usersApi.createUser(payload, token);
```
