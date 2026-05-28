# CLAUDE.md

This is a Playwright TypeScript automation framework.

## Project Overview

Playwright-based E2E and API test automation for the **Citizen Connect Cluj** digital citizen platform.

## Architecture

The project follows **Page Object Model (POM) + UI Steps Layer + API Service + Fixtures** pattern.

### Layer responsibilities

- **Tests** (`tests/`) — Spec files; receive steps and services via fixtures
- **Fixtures** (`src/fixtures/`) — Playwright dependency injection; `common.fixtures.ts` is the single import point for tests
- **UI Steps** (`src/steps/ui/`) — Compose page object calls into user flows; exposed to tests via fixtures
- **Page Objects** (`src/pages/`) — Encapsulate UI interactions per page; extend `BasePage`
- **Services** (`src/api/`) — Orchestrate multi-step API flows (e.g., login with CSRF handling); consumed by fixtures
- **API Helper** (`src/api/ApiHelper.ts`) — Fluent builder for HTTP requests with type-safe `getJson<T>()` / `postJson<T>()`
- **Data Factories** (`src/factories/`) — Generate valid, typed test data objects; used by tests and services for setup
- **Utils / Constants** (`src/utils/`, `src/constants/`, `src/model/`) — Route strings, enums, shared data models

### Data flow in tests

```
test(fixtures) → UI steps → page object methods → BasePage utilities
                  ↘ Services → ApiHelper → HTTP (Playwright request context)
```

### Steps design rules

Steps are **flow-aligned**. They are named after the user journey or feature, not the page.
- **Page Objects** = what you CAN do on a page (single-page scope)
- **Steps** = what a USER DOES in a flow (can cross multiple pages)

### Key design details
- **ApiHelper** uses a fluent/builder pattern: chain `.withPath()`, `.withBearerToken()`, `.withBody()`, etc., then call `.postJson<T>()` or `.getJson<T>()`, or `.get()` - if you don't want to extract the json response. Pass the Playwright `APIRequestContext` into each call. Every request follows the same lifecycle: build options → send request → log result → check status → return response
- Tests import `{ test, expect }` from `src/fixtures/common.fixtures.ts`, not from `@playwright/test` directly.
- Path alias `@/*` resolves to `./src/*` (configured in `tsconfig.json`).


## Code Style

- Use TypeScript.
- Do not hallucinate
- Do not add too many comments
- Prefer the simplest solution that satisfies the requirement.
- Reuse existing abstractions before creating new ones.
- Keep methods small and readable.
- Prefer explicit names over generic names.
- Follow existing project patterns.
- Do not introduce a new architecture unless explicitly requested.
- Do not weaken assertions just to make a test pass.
- When identifying web elements, prioritize `data-testid` attributes first.
- All Page objects inherit from BasePage - there we will keep the general purpose methods for a web page
- Use Interfaces for models and keep them udner model folder
- Only install npm packages when really needed, and always ask me about this

## Before Editing Code

Inspect the existing structure, identify the correct layer, and confirm whether existing abstractions can be reused before making changes.


### Commands

No npm scripts are defined. Use the Playwright CLI directly:

```bash
# Install dependencies
npm install

# Run tests
npx playwright test [tests/spec.ts] [--project=chromium] [--headed] [--debug] [--ui]

# Show report
npx playwright show-report
```


## Environment

Configuration lives in `.env`

| Variable              | Purpose                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| `BASE_URL`            | App under test URL                                                                                        |
| `FIWARE_URL`          | FIWARE backend base URL                                                                                   |
| `API_URL`             | Citizen Connect API base URL (e.g. `http://api-citizen-connect.dev.evozon.com`)                           |
| `CITIZEN_EMAIL`       | Test user email                                                                                           |
| `CITIZEN_PASS`        | Test user password                                                                                        |
| `CITIZEN_USERNAME`    | Test user display name                                                                                    |
| `CITIZEN_EMAI_PREFIX` | Email prefix for dynamic user generation                                                                  |
| `LOG_API`             | Set to `true` to enable ApiHelper request/response logging                                                |
| `PROXY_SERVER`        | Optional. Set to enable HTTP proxy (e.g. `http://127.0.0.1:8080` for Burp Suite). Leave unset to disable. |


## Additional Instructions
- When you run the tests run them only for `project=chromium`
- When you run test or debug them use Playwright MCP
  