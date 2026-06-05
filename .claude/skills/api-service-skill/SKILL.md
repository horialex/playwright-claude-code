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
