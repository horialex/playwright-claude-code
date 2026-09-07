---
name: api-service-skill
description: Use this skill any time API service classes are involved — including creating, modifying, or reviewing service methods, request builders, response handling, or API-based test setup and cleanup. This includes: building or updating service methods, structuring requests using ApiHelper, supporting test data setup via API, or refactoring service layering. Trigger whenever the user mentions API services, request chains, endpoints, API helpers, service classes, or test setup/cleanup via API. If API interaction logic is being defined or changed, use this skill.
---

# Purpose

API service classes provide a **reusable abstraction over backend interactions** for tests.  
They are used to prepare, manipulate, and validate system state faster than UI flows.

The layer is built on top of Playwright `request` fixture.

## Responsibilities

API services should:
- Build and execute **typed API requests**
- Encapsulate endpoint-specific logic in **service methods**
- Support **test setup and cleanup**
- Return **typed responses when needed**
- Use `ApiHelper` as the single request-building abstraction

## Boundaries

API services must not:
- Use **UI page objects or locators**
- Depend on **test files directly**
- Hardcode **secrets or environment-specific values**
- Suppress **useful API error information**
- Contain **UI workflow logic**

## Primary Use Cases

API services are used for:
- Test setup and teardown
- Fast state preparation
- API-based assertions or validations
- Avoiding slow UI flows
- Direct backend interaction in tests

## File and Dependency Rules

- Use `src/api/ApiHelper.ts` for all request construction
- Services should not bypass `ApiHelper`
- Return data via:
  - `APIResponse` when full response is needed
  - Typed `.getJson<T>() / .postJson<T>()` only when response unmarshalling is required

## Request Builder Pattern

All requests use fluent chaining on `api.request` and terminate with an HTTP method:

```ts
const response = await this.api.request
    .path(`${this.getApiUrl()}${Routes.EXAMPLE}`)
    .bearerToken(token)
    .body(payload)
    .expectStatus(201)
    .post();
```

## Discovering Endpoints from the API Docs

`${API_URL}/docs` does not serve a rendered Swagger UI — the page body **is** the raw OpenAPI 3.0 JSON spec (`paths`, `parameters`, `requestBody` schemas, `responses`). Treat it as the source of truth for any endpoint you don't already see wired up in `src/routes/routes.ts`.

**Before fetching, always check first whether the endpoint is already covered** by an existing `Routes` entry, service method, model, or factory — reuse it rather than re-deriving it from the spec.

### Fetching the spec

- The docs endpoint is a plain HTTP JSON response (not behind a rendered UI) — fetch it directly, e.g. `Invoke-RestMethod -Uri "$API_URL/docs"` (PowerShell) or `curl "$API_URL/docs"` (Bash). Generic web-fetch tools that don't run on this network will fail to reach it (`ECONNREFUSED`) — a direct HTTP call from this machine works.
- The spec is large (~100K+ characters). Save it to a scratch file once per session and re-use it rather than re-fetching for every lookup.
- To find a specific endpoint, grep the cached file by path fragment, tag, or keyword (e.g. `department`, `reactivate`, `registries`) rather than reading the whole file.

### Mapping the spec to project conventions

| OpenAPI element | Project convention |
| --- | --- |
| `paths./x/{y}` template, incl. optional `{/module?}` segments | Add/extend a builder fn in `Routes` (see `DEPARTMENTS` for the optional-module pattern) — don't inline path strings in services |
| `parameters` with `in: path` | Function args on the `Routes` builder |
| `parameters` with `in: query` | `.query({...})` on the request chain |
| `requestBody` schema | A typed payload in `src/model/`, built via a `src/factories/` factory — check for an existing model/factory before adding a new one |
| Documented `401` response | Pull the token via `getSessionInstance().getFromSession(SessionKeys.BEARER)` and pass with `.bearerToken(token)` |
| Success status (`200`/`201`/etc.) | `.expectStatus(<code>)` |
| Response body needed by the caller | `.postJson<T>()` / `.getJson<T>()` etc., typically merged into the domain model via `hydrateWith` (see `DepartmentService.create`) |

Wrap the resulting call in `test.step(...)` and log meaningful entities via `TestLogger`, matching the existing service methods.

### Workflow when asked to write or update a service method

1. Check whether `Routes`, a service method, model, or factory already covers this endpoint — if so, reuse/extend it instead of starting fresh.
2. If not, fetch (or reuse the cached) OpenAPI spec and grep for the target endpoint by path/tag/keyword.
3. Read that operation's parameters, `requestBody`, and `responses`.
4. Map each piece using the table above, following the existing file/dependency rules in this skill.
5. Generate the service method in the appropriate existing service class (or flag that a new service class is needed), matching neighboring methods' style.
