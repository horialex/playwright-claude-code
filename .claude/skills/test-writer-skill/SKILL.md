---
name: test-writer-skill
description: Use this skill whenever the user asks to create, update, review, or refactor automated tests, Playwright tests, spec.ts files, UI tests, API tests, service-based setup, or test scenarios.
---

# Test Writer Skill

This skill defines how Playwright test files (`*.spec.ts`) should be written, structured, and separated from Page Objects, UI Steps, and API layers.

## Core Principle

Tests describe **user-visible behavior and scenarios**, not UI mechanics or implementation details.

Tests are composed by combining:
- **UI step fixtures** for user interactions, workflows and assertions
- **API/service fixtures** for setup, teardown, authentication, and data preparation

Use API/service layers for efficient preparation when the flow is not the focus of the test or has already been validated via the UI.

Assertions should be **clear, meaningful, and scenario-oriented**, expressed through UI step methods to keep tests focused on a specific user outcome.


## Rules

- Before writing, read existing tests, factories, and fixtures. Reuse before creating.
- Always import `{ test }` from `@/fixtures/common.fixtures` — never from `@playwright/test` directly.
- Import user credentials from `@/config/users` (`admin`, `citizen`) and app config from `@/config/apps`.
- Test files end with `_tests.spec.ts`, placed under `tests/admin/` or `tests/citizen/`.
- Test data is built by factory methods under `src/factories/`. Fixtures inject step/service instances, not data.
- `describe` block: `'Digital Citizen: Role - Feature(Romanian label)'`
- Test name: `'role user can action [optional context]'`
- Use Playwright hooks where needed (`beforeEach`, `afterEach`, etc.).
- Tests should follow a realistic user workflow, focused on one main scenario.
- Use UI steps only for the behavior being tested.
- Once a flow is tested via the UI, use API/service methods for setup in later tests.
- Assertions live in UI step methods, not inline in test files.

**Available fixtures:**
- UI steps: `loginSteps`, `headerSteps`, `departmentsSteps`, `citizenRequestsSteps`, `generalSteps`
- API services: `loginService`, `departmentService`, `citizenRequestService`


## UI vs API

Use UI steps to test visible user behavior: page interactions, validation, navigation, permissions, displayed data.

Use API/service for setup, cleanup, and flows already covered by UI tests.


## Gotchas

- **Wrong import source** — `@playwright/test` is not the same as `@/fixtures/common.fixtures`. The fixture chain only wires up through the common file; using the wrong source means no steps or services are injected.
- **Inline assertions** — writing `expect(...)` directly in test bodies breaks the layer contract. Assertions belong in UI step methods.
- **Over-creating** — check `src/factories/` for existing named variants before adding new ones. Check `src/fixtures/` before assuming a fixture doesn't exist.


## Example

See `examples/department.txt` for the expected pattern and `tests/admin/departments/department_tests.spec.ts` as the live reference:
- first test covers the flow through the UI
- later tests use service methods for setup
- test data from factory methods, test objects injected via fixtures
