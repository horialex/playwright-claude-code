# Digital Citizens Automation Testing Project

## Project Overview

Playwright-based E2E automation testing project for the **Citizen Connect Cluj** digital citizen platform.

### Architecture: POM + Steps + API Services + Fixtures

The project uses a 5-layer architecture:

```
Tests → UI Steps → Page Objects → BasePage utilities
              ↘ Services → ApiHelper → HTTP
```

#### Key Directories

| Path             | Role                                                          |
| ---------------- | ------------------------------------------------------------- |
| `tests/`         | Spec files — describe *what* to test                          |
| `src/steps/ui/`  | UI Steps — user-level flows, wrap page calls in `test.step()` |
| `src/pages/`     | Page Objects — UI interactions per page, extend `BasePage`    |
| `src/api/`       | API Services + `ApiHelper` fluent request builder             |
| `src/fixtures/`  | Dependency injection chain (most important wiring layer)      |
| `src/factories/` | Test data generators via `@faker-js/faker`                    |
| `src/model/`     | TypeScript interfaces/enums for DTOs                          |
| `src/config/`    | User credentials, app config (sourced from `.env`)            |

#### How the Pieces Connect

**The fixture chain** is the backbone — each layer extends the previous:

```
base.fixtures.ts       → custom page lifecycle
  api.fixtures.ts      → LoginService, DepartmentService, ApiHelper
    page.fixtures.ts   → LoginPage, DepartmentsPage, etc.
      steps.fixtures.ts  → LoginSteps, DepartmentsSteps, etc.
        common.fixtures.ts  ← tests import { test, expect } from here
```

**In a test:**
1. Test receives steps (e.g. `loginSteps`, `departmentsSteps`) via fixtures
2. Steps orchestrate page object method calls, each wrapped in `test.step()` for reporting
3. Pages hold private locators and translate actions to Playwright calls
4. Services use `ApiHelper`'s fluent builder for typed API calls (`api.request.path(...).bearerToken(...).postJson<T>()`)
5. Factories generate isolated test data; models keep it type-safe

Tests never import from `@playwright/test` directly — always from `src/fixtures/common.fixtures.ts`.

---

Run automated tests for specific spec file:

```bash 
npx playwright test tests/login_api.spec.ts --project=chromium --headed 
```


## API documentation
API documentation: http://api-citizen-connect.dev.evozon.com/docs


## AI documentation

### Available Skills

Skills are invoked with `/skill-name` and guide Claude to follow project conventions for each layer.

| Skill                      | When to use                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| `/test-writer-skill`       | Create, update, review, or refactor spec files and test scenarios                               |
| `/pom-skill`               | Create or modify Page Object Models, locators, and `BasePage` patterns                          |
| `/ui-steps-skill`          | Create or maintain UI step definitions that orchestrate POM actions into user flows             |
| `/api-service-skill`       | Create or modify API service classes, `ApiHelper` request builders, and API-based test setup    |
| `/fixtures-skill`          | Create or modify fixture files that wire pages, services, and steps via dependency injection    |
| `/data-factory-skill`      | Create or modify test data factories, typed builders, faker usage, and API payload mapping      |
| `/locator-scout-skill`     | Discover, verify, or generate Playwright locators against the live app before writing selectors |
| `/playwright-cli`          | Automate browser interactions and work directly with Playwright tests                           |
| `/summarize-changes-skill` | Summarize uncommitted changes, generate commit messages, or review a diff                       |

### Agent-Assisted Test Completion (`/continue-test`)

We have a **continue-test** command that allows us to let the agent continue a test.
Use `/continue-test` when you want the agent to take over a test at a `page.pause()` breakpoint and write the remaining steps. This uses the playwright-cli to let the agent look over the DOM structure and it is usefull when you want the agent to write you the selectors or you want to write the rest of the test code.


#### Prerequisites

Add `await page.pause()` at the point in your test where you want the agent to take over.

#### Usage

**Let the agent run the test:**
```
/continue-test tests/mySpec.ts "My test title"
```

**If the browser is already paused (you ran the test manually):**
```
/continue-test
```

- If your test is marked with `.only`, you don't need to specify the test title — Playwright will respect it automatically.
- The agent attaches to the live browser, inspects the page, generates locators, and writes the remaining test code across the correct layers (POM, UI Steps, API services, spec).