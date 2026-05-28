# ApiHelper Documentation

## Purpose

`ApiHelper` is a lightweight fluent API wrapper over Playwright's `APIRequestContext`.

It is designed for API testing projects that need:

- readable request chains
- reusable service methods
- optional bearer token authentication
- optional status validation
- raw `APIResponse` access
- typed JSON response extraction
- simple logging through `LOG_API=true`

The helper keeps the API simple and avoids making tests repeat low-level request setup.

---

## Main Usage Style

```ts
const response = await api.request
  .path('/users')
  .bearerToken(token)
  .expectStatus(200)
  .get();
```

With JSON extraction:

```ts
const user = await api.request
  .path('/users/123')
  .bearerToken(token)
  .expectStatus(200)
  .getJson<UserResponse>();
```

With POST body:

```ts
const createdUser = await api.request
  .path('/users')
  .bearerToken(token)
  .body({
    name: 'John Doe',
    email: 'john@test.com',
  })
  .expectStatus(201)
  .postJson<UserResponse>();
```

---

## Design Overview

The helper has two classes:

```ts
export class ApiHelper
class ApiRequest
```

### `ApiHelper`

`ApiHelper` is the public class used by tests, services, or fixtures.

It owns the Playwright `APIRequestContext`.

```ts
const api = new ApiHelper(request);
```

It exposes a getter:

```ts
api.request
```

Every call to `api.request` creates a fresh `ApiRequest` instance.

This is important because each request chain has its own isolated state.

Safe usage:

```ts
await api.request.path('/users').get();
await api.request.path('/orders').get();
```

The second request does not reuse the path, body, headers, token, or expected status from the first request.

---

## Fluent Request API

The fluent API is available through:

```ts
api.request
```

Example:

```ts
await api.request
  .path('/users')
  .bearerToken(token)
  .query({ page: 1, size: 20 })
  .expectStatus(200)
  .get();
```

---

## Available Fluent Methods

### `.path(path: string)`

Sets the endpoint path.

```ts
.path('/users')
```

Required before calling an HTTP method.

If `.path()` is not provided, the helper throws:

```txt
API request path was not provided. Use .path("/endpoint") before calling the HTTP method.
```

---

### `.bearerToken(token: string)`

Adds an Authorization header using the Bearer token scheme.

```ts
.bearerToken(accessToken)
```

Internally this creates:

```ts
Authorization: `Bearer ${accessToken}`
```

Example:

```ts
await api.request
  .path('/users')
  .bearerToken(token)
  .get();
```

---

### `.header(name: string, value: string)`

Adds a single header.

```ts
.header('x-correlation-id', 'abc-123')
```

Example:

```ts
await api.request
  .path('/users')
  .header('x-correlation-id', 'test-id')
  .get();
```

---

### `.headers(headers: Record<string, string>)`

Adds multiple headers.

```ts
.headers({
  'x-correlation-id': 'abc-123',
  'x-client-name': 'api-tests',
})
```

Example:

```ts
await api.request
  .path('/users')
  .headers({
    'x-correlation-id': 'abc-123',
    'x-client-name': 'api-tests',
  })
  .get();
```

---

### `.query(params: QueryParams)`

Adds query parameters.

```ts
.query({
  page: 1,
  size: 20,
  active: true,
})
```

Example:

```ts
await api.request
  .path('/users')
  .query({
    page: 1,
    size: 20,
  })
  .expectStatus(200)
  .get();
```

---

### `.body(body: RequestBody)`

Adds a JSON-style request body.

```ts
.body({
  name: 'John Doe',
  email: 'john@test.com',
})
```

Example:

```ts
await api.request
  .path('/users')
  .body({
    name: 'John Doe',
    email: 'john@test.com',
  })
  .expectStatus(201)
  .post();
```

Calling `.body()` clears any previously set `.form()` value on that request chain.

---

### `.form(form: FormBody)`

Adds form data.

Use this for `application/x-www-form-urlencoded` style requests.

```ts
.form({
  username: 'demo-user',
  password: 'demo-password',
})
```

Example:

```ts
await api.request
  .path('/login')
  .form({
    username: 'demo-user',
    password: 'demo-password',
  })
  .expectStatus(200)
  .post();
```

Calling `.form()` clears any previously set `.body()` value on that request chain.

---

### `.expectStatus(status: number)`

Validates the response status.

```ts
.expectStatus(201)
```

If the actual status does not match the expected status, the helper throws an error with:

- HTTP method
- request path
- expected status
- actual status
- response body, if readable

Example:

```ts
await api.request
  .path('/users')
  .body(payload)
  .expectStatus(201)
  .post();
```

If no `.expectStatus()` is used, the helper does not validate the status.

---

## Raw Response Methods

These methods return Playwright's `APIResponse`.

```ts
.get()
.post()
.put()
.patch()
.delete()
```

Example:

```ts
const response = await api.request
  .path('/users')
  .expectStatus(200)
  .get();

expect(response.status()).toBe(200);
```

Use raw response methods when you need access to:

- status
- headers
- response text
- response body
- Playwright response methods

---

## JSON Response Methods

These methods execute the request and return parsed JSON.

```ts
.getJson<T>()
.postJson<T>()
.putJson<T>()
.patchJson<T>()
.deleteJson<T>()
```

Example:

```ts
type UserResponse = {
  id: string;
  name: string;
  email: string;
};

const user = await api.request
  .path('/users/123')
  .expectStatus(200)
  .getJson<UserResponse>();

expect(user.id).toBeDefined();
```

### Important note about `deleteJson<T>()`

Only use `deleteJson<T>()` if the DELETE endpoint actually returns a JSON body.

Many DELETE endpoints return:

```txt
204 No Content
```

For those endpoints, use:

```ts
await api.request
  .path('/users/123')
  .expectStatus(204)
  .delete();
```

Do not use:

```ts
await api.request
  .path('/users/123')
  .expectStatus(204)
  .deleteJson<SomeType>();
```

because there is no body to parse.

---

## Example: GET Request

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

---

## Example: GET Request with Typed JSON

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

## Example: POST Request

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

const createdUser = await api.request
  .path('/users')
  .bearerToken(token)
  .body(payload)
  .expectStatus(201)
  .postJson<UserResponse>();

expect(createdUser.id).toBeDefined();
expect(createdUser.name).toBe(payload.name);
```

---

## Example: PUT Request

```ts
const updatedUser = await api.request
  .path(`/users/${userId}`)
  .bearerToken(token)
  .body({
    name: 'John Updated',
  })
  .expectStatus(200)
  .putJson<UserResponse>();

expect(updatedUser.name).toBe('John Updated');
```

---

## Example: PATCH Request

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

## Example: DELETE Request

```ts
await api.request
  .path(`/users/${userId}`)
  .bearerToken(token)
  .expectStatus(204)
  .delete();
```

---

## Example: Form Data POST

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

---

## Recommended Service Layer Usage

The helper is intended to be used inside service classes.

A service class should represent one domain area, such as:

- `UsersApiService`
- `AuthApiService`
- `OrdersApiService`
- `ProductsApiService`

Example:

```ts
import { ApiHelper } from '../helpers/ApiHelper';

export type CreateUserRequest = {
  name: string;
  email: string;
  role: string;
};

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export class UsersApiService {
  private readonly api: ApiHelper;

  constructor(api: ApiHelper) {
    this.api = api;
  }

  async createUser(payload: CreateUserRequest, token: string): Promise<UserResponse> {
    return this.api.request
      .path('/users')
      .bearerToken(token)
      .body(payload)
      .expectStatus(201)
      .postJson<UserResponse>();
  }

  async getUserById(userId: string, token: string): Promise<UserResponse> {
    return this.api.request
      .path(`/users/${userId}`)
      .bearerToken(token)
      .expectStatus(200)
      .getJson<UserResponse>();
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

---

## Recommended Fixture Usage

You can expose `ApiHelper` and API services as Playwright fixtures.

Example:

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
    const api = new ApiHelper(request);
    await use(api);
  },

  usersApi: async ({ api }, use) => {
    const usersApi = new UsersApiService(api);
    await use(usersApi);
  },
});

export { expect } from '@playwright/test';
```

Test usage:

```ts
import { test, expect } from '../../fixtures/apiFixtures';

test('should create user', async ({ usersApi }) => {
  const token = 'some-access-token';

  const user = await usersApi.createUser(
    {
      name: 'John Doe',
      email: `john.${Date.now()}@test.com`,
      role: 'admin',
    },
    token
  );

  expect(user.id).toBeDefined();
});
```

---

## Logging

Logging is controlled by the environment variable:

```bash
LOG_API=true
```

When enabled, each request logs:

```txt
[API LOG] METHOD path → status
```

Example:

```txt
[API LOG] POST /users → 201
```

If `LOG_API` is not set to `true`, no API logs are printed.

---

## Error Handling

If `.expectStatus()` is used and the response status does not match, the helper throws an error.

Example error:

```txt
Unexpected API response status.
Request: POST /users
Expected: 201
Actual: 400
Body: {"message":"Invalid request"}
```

This helps debugging failed API tests without needing to manually print every response.

---

## Current Types

```ts
type Headers = Record<string, string>;

type QueryParams = Record<string, string | number | boolean>;

type RequestBody =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null;

type FormBody = Record<string, string | number | boolean>;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
```

---

## Current Full Implementation

```ts
import { APIRequestContext, APIResponse } from '@playwright/test';

type Headers = Record<string, string>;
type QueryParams = Record<string, string | number | boolean>;
type RequestBody =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null;

type FormBody = Record<string, string | number | boolean>;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class ApiHelper {
  readonly apiContext: APIRequestContext;
  private readonly shouldLog: boolean;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
    this.shouldLog = process.env.LOG_API === 'true';
  }

  get request(): ApiRequest {
    return new ApiRequest(this);
  }

  log(method: HttpMethod, path: string, status: number): void {
    if (this.shouldLog) {
      console.log(`[API LOG] ${method} ${path} → ${status}`);
    }
  }
}

class ApiRequest {
  private readonly api: ApiHelper;

  private requestPath = '';
  private requestHeaders: Headers = {};
  private requestQuery?: QueryParams;
  private requestBody?: RequestBody;
  private requestForm?: FormBody;
  private expectedStatus?: number;
  private bearer?: string;

  constructor(api: ApiHelper) {
    this.api = api;
  }

  path(path: string): this {
    this.requestPath = path;
    return this;
  }

  bearerToken(token: string): this {
    this.bearer = token;
    return this;
  }

  header(name: string, value: string): this {
    this.requestHeaders[name] = value;
    return this;
  }

  headers(headers: Headers): this {
    this.requestHeaders = {
      ...this.requestHeaders,
      ...headers,
    };

    return this;
  }

  query(params: QueryParams): this {
    this.requestQuery = params;
    return this;
  }

  body(body: RequestBody): this {
    this.requestBody = body;
    this.requestForm = undefined;
    return this;
  }

  form(form: FormBody): this {
    this.requestForm = form;
    this.requestBody = undefined;
    return this;
  }

  expectStatus(status: number): this {
    this.expectedStatus = status;
    return this;
  }

  async get(): Promise<APIResponse> {
    return this.send('GET');
  }

  async post(): Promise<APIResponse> {
    return this.send('POST');
  }

  async put(): Promise<APIResponse> {
    return this.send('PUT');
  }

  async patch(): Promise<APIResponse> {
    return this.send('PATCH');
  }

  async delete(): Promise<APIResponse> {
    return this.send('DELETE');
  }

  async getJson<T>(): Promise<T> {
    const response = await this.get();
    return response.json() as Promise<T>;
  }

  async postJson<T>(): Promise<T> {
    const response = await this.post();
    return response.json() as Promise<T>;
  }

  async putJson<T>(): Promise<T> {
    const response = await this.put();
    return response.json() as Promise<T>;
  }

  async patchJson<T>(): Promise<T> {
    const response = await this.patch();
    return response.json() as Promise<T>;
  }

  async deleteJson<T>(): Promise<T> {
    const response = await this.delete();
    return response.json() as Promise<T>;
  }

  private async send(method: HttpMethod): Promise<APIResponse> {
    if (!this.requestPath) {
      throw new Error(
        'API request path was not provided. Use .path("/endpoint") before calling the HTTP method.'
      );
    }

    const headers = this.resolveHeaders();

    const options = {
      headers,
      params: this.requestQuery,
      data: this.requestBody,
      form: this.requestForm,
    };

    const response = await this.execute(method, options);

    this.api.log(method, this.requestPath, response.status());

    await this.validateStatus(method, response);

    return response;
  }

  private resolveHeaders(): Headers {
    if (!this.bearer) {
      return this.requestHeaders;
    }

    return {
      Authorization: `Bearer ${this.bearer}`,
      ...this.requestHeaders,
    };
  }

  private async execute(
    method: HttpMethod,
    options: {
      headers: Headers;
      params?: QueryParams;
      data?: RequestBody;
      form?: FormBody;
    }
  ): Promise<APIResponse> {
    switch (method) {
      case 'GET':
        return this.api.apiContext.get(this.requestPath, options);

      case 'POST':
        return this.api.apiContext.post(this.requestPath, options);

      case 'PUT':
        return this.api.apiContext.put(this.requestPath, options);

      case 'PATCH':
        return this.api.apiContext.patch(this.requestPath, options);

      case 'DELETE':
        return this.api.apiContext.delete(this.requestPath, options);

      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }

  private async validateStatus(method: HttpMethod, response: APIResponse): Promise<void> {
    if (this.expectedStatus === undefined) {
      return;
    }

    if (response.status() === this.expectedStatus) {
      return;
    }

    const responseBody = await this.safeResponseBody(response);

    throw new Error(
      [
        'Unexpected API response status.',
        `Request: ${method} ${this.requestPath}`,
        `Expected: ${this.expectedStatus}`,
        `Actual: ${response.status()}`,
        `Body: ${responseBody}`,
      ].join('\n')
    );
  }

  private async safeResponseBody(response: APIResponse): Promise<string> {
    try {
      return await response.text();
    } catch {
      return '<could not read response body>';
    }
  }
}
```

---

## Recommended Conventions

### Use service methods for repeated business flows

Preferred:

```ts
const user = await usersApi.createUser(payload, token);
```

Avoid repeating this in many tests:

```ts
const user = await api.request
  .path('/users')
  .bearerToken(token)
  .body(payload)
  .expectStatus(201)
  .postJson<UserResponse>();
```

Use the low-level helper directly only for one-off or custom API calls.

---

### Keep `ApiHelper` generic

Do not put domain-specific methods inside `ApiHelper`.

Avoid:

```ts
api.createUser()
api.login()
api.createOrder()
```

Prefer services:

```ts
usersApi.createUser()
authApi.login()
ordersApi.createOrder()
```

---

### Keep auth generic

The helper supports generic bearer auth:

```ts
.bearerToken(token)
```

Do not hardcode project-specific token lookup inside `ApiHelper`.

Project-specific token retrieval should live in:

- fixtures
- auth services
- setup utilities
- test data layer

---

### Use `.expectStatus()` for service methods

Service methods should usually validate the expected status internally.

Example:

```ts
async createUser(payload: CreateUserRequest, token: string): Promise<UserResponse> {
  return this.api.request
    .path('/users')
    .bearerToken(token)
    .body(payload)
    .expectStatus(201)
    .postJson<UserResponse>();
}
```

This keeps tests cleaner.

---

### Use raw response methods for negative tests

For negative tests, sometimes you may want to inspect the response manually.

Example:

```ts
const response = await api.request
  .path('/users')
  .bearerToken(token)
  .body(invalidPayload)
  .post();

expect(response.status()).toBe(400);
```

You can also use `.expectStatus(400)` if the status is known:

```ts
const response = await api.request
  .path('/users')
  .bearerToken(token)
  .body(invalidPayload)
  .expectStatus(400)
  .post();

const body = await response.json();
expect(body.message).toContain('Invalid');
```

---

## Extension Ideas

Keep these optional. Do not add them unless the project needs them.

Possible future extensions:

- `.contentTypeJson()`
- `.acceptJson()`
- `.basicAuth(username, password)`
- `.apiKey(name, value)`
- `.timeout(ms)`
- `.failOnStatusCode()`
- `.attachFile()`
- request/response logging with body
- response schema validation
- automatic token fixture integration

The current design is intentionally minimal.
