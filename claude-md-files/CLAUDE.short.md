# CLAUDE.short.md

Playwright E2E + API tests for **Citizen Connect Cluj** at `http://client-citizen-connect.dev.evozon.com`.

## Commands
```bash
npm install
npx playwright test [tests/file.spec.ts] [--project=chromium] [--headed] [--ui] [--debug]
npx playwright show-report
```

## Architecture (POM + Service Layer + Fixtures)

| Layer | Location | Purpose |
|---|---|---|
| Tests | `tests/` | Spec files |
| Fixtures | `src/fixtures/` | DI; import `{ test, expect }` from `common.fixtures.ts` |
| UI Steps | `src/steps/ui/` | Flow-aligned user journeys (can cross pages) |
| Page Objects | `src/pages/` | Per-page interactions; extend `BasePage` |
| Services | `src/api/` | Multi-step API flows (e.g. CSRF login) |
| ApiHelper | `src/api/ApiHelper.ts` | Fluent HTTP builder |

**ApiHelper:** chain `.withPath()`, `.withBearerToken()`, `.withBody()` → `.getJson<T>()` / `.postJson<T>()` / `.get()`  
**Path alias:** `@/*` → `./src/*`  
**Selectors:** prefer `data-testid`  
**Motto:** KISS

## Environment (`.env`)
`BASE_URL`, `FIWARE_URL`, `API_URL`, `CITIZEN_EMAIL`, `CITIZEN_PASS`, `CITIZEN_USERNAME`, `CITIZEN_EMAIL_PREFIX`, `LOG_API`, `PROXY_SERVER`
