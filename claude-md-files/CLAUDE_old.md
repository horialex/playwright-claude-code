# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


## Project Overview

Playwright-based E2E and API test automation for the **Citizen Connect Cluj** digital citizen platform. The app under test runs on a FIWARE-backed architecture at `http://client-citizen-connect.dev.evozon.com`.

## Commands

No npm scripts are defined. Use the Playwright CLI directly:

```bash
# Install dependencies
npm install

# Run all tests
npx playwright test

# Run a specific spec
npx playwright test tests/login_api.spec.ts

# Run a specific spec in a specific browser
npx playwright test tests/login_api.spec.ts --project=chromium

# Run headed (with browser visible)
npx playwright test --headed

# Run with UI inspector
npx playwright test --ui

# Debug mode (step through)
npx playwright test --debug

# View last HTML report
npx playwright show-report
```

## My architectural moto: 
KISS - keep it simple stupid

## Architecture

The project follows **Page Object Model (POM) + Service Layer + Fixtures** pattern.

### Layer responsibilities

| Layer             | Location                                     | Purpose                                                                                    |
| ----------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Tests             | `tests/`                                     | Spec files; receive steps and services via fixtures                                        |
| Fixtures          | `src/fixtures/`                              | Playwright dependency injection; `common.fixtures.ts` is the single import point for tests |
| UI Steps          | `src/steps/ui/`                              | Compose page object calls into user flows; exposed to tests via fixtures                   |
| Page Objects      | `src/pages/`                                 | Encapsulate UI interactions per page; extend `BasePage`                                    |
| Services          | `src/api/`                                   | Orchestrate multi-step API flows (e.g., login with CSRF handling); consumed by fixtures    |
| API Helper        | `src/api/ApiHelper.ts`                       | Fluent builder for HTTP requests with type-safe `getJson<T>()` / `postJson<T>()`           |
| Utils / Constants | `src/utils/`, `src/constants/`, `src/model/` | Route strings, enums, shared data models                                                   |

### Data flow in tests

```
test(fixtures) → UI steps → page object methods → BasePage utilities
                  ↘ Services → ApiHelper → HTTP (Playwright request context)
```

### Steps design rules

Steps are **flow-aligned**. They are named after the user journey or feature, not the page.

- **Page Objects** = what you CAN do on a page (single-page scope)
- **Steps** = what a USER DOES in a flow (can cross multiple pages)
- 
### Key design details


- **ApiHelper** uses a fluent/builder pattern: chain `.withPath()`, `.withBearerToken()`, `.withBody()`, etc., then call `.postJson<T>()` or `.getJson<T>()`, or `.get()` - if you don't want to extract the json response. Pass the Playwright `APIRequestContext` into each call. Every request follows the same lifecycle: build options → send request → log result → check status → return response
- **LoginService** extracts CSRF tokens from HTML responses (`HtmlHelper`), then uses `page.request` (shares the browser context/cookies) to perform the login flow.
- **Fixtures** in `base.fixtures.ts` set up the browser context; `api.fixtures.ts` wires in `APIRequestContext` and `LoginService`; `page.fixtures.ts` wires in page objects. All are re-exported from `common.fixtures.ts`.
- Tests import `{ test, expect }` from `src/fixtures/common.fixtures.ts`, not from `@playwright/test` directly.
- Path alias `@/*` resolves to `./src/*` (configured in `tsconfig.json`).
- When identifying web elements - first prioritize data-testid if possible

#### ApiHelper
ApiHelper = the thing that knows HOW to send requests
ApiRequest = the thing that builds ONE specific request

So ApiRequest needs a reference back to ApiHelper so it can say: I finished building the request. Now please use your apiContext to send it.
- ApiHelper creates ApiRequest and is a wrapper around Playwright API testing.
- ApiRequest uses ApiHelper and is a request builder.
- Techinques used: Builder Pattern, Fluent Interface, Composition

## Environment

Configuration lives in `.env` (not committed — see `.gitignore`). Required variables:

| Variable              | Purpose                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| `BASE_URL`            | App under test URL                                                                                        |
| `FIWMARE_URL`         | FIWARE backend base URL                                                                                   |
| `API_URL`             | Citizen Connect API base URL (e.g. `http://api-citizen-connect.dev.evozon.com`)                           |
| `CITIZEN_EMAIL`       | Test user email                                                                                           |
| `CITIZEN_PASS`        | Test user password                                                                                        |
| `CITIZEN_USERNAME`    | Test user display name                                                                                    |
| `CITIZEN_EMAI_PREFIX` | Email prefix for dynamic user generation                                                                  |
| `LOG_API`             | Set to `true` to enable ApiHelper request/response logging                                                |
| `PROXY_SERVER`        | Optional. Set to enable HTTP proxy (e.g. `http://127.0.0.1:8080` for Burp Suite). Leave unset to disable. |

## Known technical debt
