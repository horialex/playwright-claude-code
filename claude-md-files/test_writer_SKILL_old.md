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

Use API/service layers for efficient preparation (e.g. creating test data or logging in) when the flow is not the focus of the test or has already been validated via the UI.

Asertions should be **clear, meaningful, and scenario-oriented**, and should be expressed through UI steps wherever possible to keep tests readable and focused on validating a specific user outcome.

- Tests = scenario orchestration + assertions
- UI Steps = user-level actions (business intent)
- Page Objects (POMs) = UI mechanics (locators + low-level interactions)
- API/Services = setup, teardown, and backend operations


## Rules

- Test files must end with `spec.ts`.
- Use existing fixture files for test data.
- Use Playwright hooks where needed like `beforeEach, afterEach` etc
- Test data is created via factory methods that live under `src/factories`
- Tests should follow a realistic user workflow.
- Use UI steps only for the behavior being tested.
- Once a flow is tested through the UI, use API/service methods for setup in later tests.
- Use API/service methods for repeated setup and cleanup.
- Keep tests focused on one main scenario.
- Use clear, meaningful assertions that live under specific UI step files

## UI vs API

Use UI steps to test visible user behavior, page interactions, validation, navigation, permissions, or displayed data.

Use API/service steps for setup, cleanup, and flows already covered by UI tests.

Example: if department creation is already tested through the UI, create departments in later tests with `createDepartment` from `src/api/DepartmentService.ts`.

## Example

Reference `examples/department.ts` for the expected pattern:
- first test covers department creation through the UI
- later tests use `createDepartment` for setup
- test data comes from factories files
- test objects come from fixtures