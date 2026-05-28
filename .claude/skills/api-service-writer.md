---
name: api-convention
description: Conventions for writing API Service classes and test helpers in this automation project
---

# API Conventions

They are used for:
- Test setup
- Test cleanup
- API-based assertions
- Faster creation of required state
- Avoiding slow UI setup
- Use `src/api/ApiHelper.ts` to build the requests in Service classes
- Return the response as JSON with `getJson` or `postJSON` only when we need to unmarshall the response ponse 

API services should not:
- Use page objects.
- Use UI locators.
- Depend on test files directly.
- Hardcode secrets.
- Hide failed API responses without useful error messages.


## Before Adding a Method

1. Check existing service methods.
2. Follow existing naming and typing patterns.
3. Use data factory output if appropriate.
4. Add cleanup support if test data is created.

## ApiHelper fluent chain

Every request is built by chaining on `api.request`, then terminated with an HTTP verb:

```ts
const response = await this.api.request
    .path(`${this.getApiUrl()}${Routes.SOME_ENDPOINT}`)
    .bearerToken(token)          // optional
    .body(payload)               // JSON body
    .expectStatus(201)           // optional — throws with full context on mismatch
    .post();
```

Terminate with:
- `.post()` / `.get()` / `.put()` / `.patch()` / `.delete()` — returns `APIResponse`
- `.postJson<T>()` / `.getJson<T>()` etc. — returns `T` (use only when you need to unmarshal the response body)

Body setters (mutually exclusive — setting one clears the others):
- `.body(obj)` — JSON body
- `.form(obj)` — URL-encoded form
- `.multipart(obj)` — multipart/form-data

## Service constructor

Use `page.request` when the service needs to share the browser session (cookies, SSO):
```ts
constructor(page: Page) {
    this.api = new ApiHelper(page.request);
}
```

Use `APIRequestContext` when the service makes independent API calls (e.g., test data setup):
```ts
constructor(apiContext: APIRequestContext) {
    this.api = new ApiHelper(apiContext);
}
```

## Service method shape

Every public method wraps its work in `test.step()`:
```ts
async submitSomething(payload: SomePayload, token: string): Promise<APIResponse> {
    return test.step(`Submit something`, async () => {
        return this.api.request
            .path(...)
            .bearerToken(token)
            .body(payload)
            .post();
    });
}
```
 