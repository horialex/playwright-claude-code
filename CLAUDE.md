# CLAUDE.md
This is a Playwright TypeScript automation testing project.

## Project Overview
Playwright-based E2E automation testing project for the **Citizen Connect Cluj** digital citizen platform.

## Commands
@.claude/commands.md

## Architecture
The project follows **Page Object Model (POM) + UI Steps Layer + API Service + Fixtures** pattern.

### Layer responsibilities
- **Tests** (`tests/`) — Spec files; receive ui steps and api services methods via fixtures
- **Fixtures** (`src/fixtures/`) — Playwright dependency injection; `common.fixtures.ts` is the single import point for tests
- **UI Steps** (`src/steps/ui/`) — Compose page object calls into user flows; exposed to tests via fixtures
- **Services** (`src/api/`) — Orchestrate multi-step API flows (e.g., login with CSRF handling); consumed by fixtures
- **Page Objects** (`src/pages/`) — Encapsulate UI interactions per page or page section; extend `BasePage`
- **API Helper** (`src/api/ApiHelper.ts`) — Layer over Playwright `apiRequest` fixture that builds the requests using fluent builder pattern
- **Data Factories** (`src/factories/`) — Generate test data objects; used by tests and services for setup
- **Utils / Constants** (`src/utils/`, `src/constants/`, `src/model/`) — Route strings, enums, constants, shared data models

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
- Tests import `{ test, expect }` from `src/fixtures/common.fixtures.ts`, not from `@playwright/test` directly.
- Path alias `@/*` resolves to `./src/*` (configured in `tsconfig.json`).


## Code Style
- Use TypeScript.
- Use the simplest solution that satisfies the requirement.
- Reuse existing abstractions before creating new ones.
- Keep methods small and readable.
- Use explicit names over generic names.
- Only install npm packages when really needed, and always ask me about this

## Before Editing Code
Inspect the existing structure, identify the correct layer, and confirm whether existing abstractions can be reused before making changes.


## Environment
@.claude/environment.md


## Additional Instructions
- When you run the tests run them only for `project=chromium`
