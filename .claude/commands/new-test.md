Write a new automated Playwright test for the **Citizen Connect Cluj** platform, following the project's layered architecture (POM + UI Steps + API Services + Fixtures).

## Input from user

$ARGUMENTS

---

## Phase 0 — Parse the input

Extract from the arguments:
- **Test case description** — what needs to be automated
- **Reference test** (optional) — a file path like `tests/citizen/some_spec.ts` mentioned after keywords like "ref", "based on", "like", "similar to", "take context from", or "inspire from"

If a reference test path was given, **read that file now** before doing anything else. Use it to understand the intended patterns, fixture usage, step naming style, and level of granularity for this area of the app.

---

## Phase 1 — Understand the test case

Identify:
- **User role** — citizen, admin, or other
- **Feature / flow** — what the user is doing
- **Pages involved** — which UI screens are touched
- **Data requirements** — what test data is needed (use factories where possible)
- **Assertions** — what constitutes a passing test
- **Type** — UI-only, API-only, or mixed (UI login + API actions, etc.)

---

## Phase 2 — Audit existing layers

Before creating anything, search and read what already exists. Only create what is genuinely missing.

| Layer | Location | What to check |
|-------|----------|---------------|
| Page Objects | `src/pages/` | Is there a page covering the required UI interactions? Can you add methods to an existing POM? |
| UI Steps | `src/steps/ui/` | Is there a Steps class for this flow? Can you extend it? |
| API Services | `src/api/` | Is there a service for the API calls needed? |
| Fixtures | `src/fixtures/steps.fixtures.ts`, `api.fixtures.ts` | Are the required pages/steps/services already wired? |
| Factories | `src/factories/` | Is there a factory for the test data needed? |
| Routes | `src/routes/routes.ts` | Are the relevant URL paths already defined? |
| Constants | `src/constants/` | Are the required enums / UI strings already defined? |
| Config | `src/config/users.ts` | Is the right user credential object available? |

---

## Phase 3 — Plan and confirm

List exactly what will be created or extended at each layer. Keep changes minimal — only add what this test requires. Present the plan briefly before writing any code.

---

## Phase 4 — Implement bottom-up

Work from the lowest layer upward, in this order:

### 4a. Constants / Routes (if missing)
Add any new enums, UI label strings, or URL paths to the relevant files in `src/constants/` or `src/routes/`.

### 4b. Page Objects (if missing or incomplete)
- Extend an existing POM or create a new class that `extends BasePage`
- Declare locators as `private readonly` fields, initialized in the constructor using semantic selectors (`getByRole`, `getByLabel`, `getByText` preferred over CSS)
- Keep methods single-purpose and page-scoped

Use the **pom-skill** for this step.

### 4c. UI Steps (if missing or incomplete)
- Add methods to an existing Steps class or create a new one
- Name methods after user intent, not page actions (e.g. `submitCitizenRequest`, not `fillFormAndClickSubmit`)
- Wrap each method body in `test.step('...', async () => { ... })` for Playwright reporting
- A Steps method may span multiple pages

Use the **ui-steps-skill** for this step.

### 4d. API Services (if needed and missing)
- Add to an existing service or create a new one using `ApiHelper`'s fluent builder pattern
- Handle CSRF tokens and auth as the existing `LoginService` does

Use the **api-service-skill** for this step.

### 4e. Fixtures wiring (if new pages/steps/services were created)
- Wire new Page Objects into `src/fixtures/page.fixtures.ts`
- Wire new Steps classes into `src/fixtures/steps.fixtures.ts`
- Wire new API services into `src/fixtures/api.fixtures.ts`

Use the **fixtures-skill** for this step.

### 4f. Test spec
- Place the file under `tests/<role>/` matching the user role (e.g. `tests/citizen/`, `tests/admin/departments/`)
- Import only from `@/fixtures/common.fixtures.ts`, never from `@playwright/test` directly
- Receive everything via fixture injection — never instantiate pages, steps, or services in the test body
- `test.describe` names the feature; `test()` names the user intent
- Use `test.beforeEach` / `test.afterEach` for setup and cleanup
- Keep assertions in the test (or a dedicated verify step), not buried inside Steps

Use the **test-writer-skill** for this step.

---

## Phase 5 — Run and verify

Run the new test with chromium only:

```bash
npx playwright test tests/path/to/new_spec.ts --project=chromium --headed
```

Watch the output. If it fails, diagnose and fix before reporting done. If it passes, confirm the assertions are actually exercised and not vacuously true.
