---
name: test-writer-skill
description: Use this skill whenever the user asks to create, update, review, or refactor automated tests, Playwright tests, spec.ts files, UI tests, API tests, service-based setup, or test scenarios.
---

# Test Writer Skill

Use this skill for automated test files.

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

Reference `examples/department.txt` for the expected pattern:
- first test covers department creation through the UI
- later tests use `createDepartment` for setup
- test data comes from factories files
- test objects come from fixtures