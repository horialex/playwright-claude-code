---
name: fixtures-skill
description: Use this skill when creating, modifying, or reviewing Playwright fixture files that wire up pages, services, steps, and test data via dependency injection.
---

## Fixture Rules

Ground rule: identify the correct fixture file based on what the fixture instantiates, then add it there.

Fixtures own:
- Instantiating and injecting pages, services, and steps into tests
- Providing shared test data objects built via factories or API setup
- Lifecycle teardown after `use()` (e.g. API cleanup)

Fixtures do not own:
- Business logic or UI interactions
- Assertions
- Generating test data (that belongs in factories)

## Fixture Files

- `base.fixtures.ts` — page lifecycle
- `api.fixtures.ts` — ApiHelper and service instances
- `page.fixtures.ts` — page object instances
- `steps.fixtures.ts` — step instances and shared test data objects
- `common.fixtures.ts` — single re-export point; tests import only from here

## Adding a New Fixture

1. Identify the correct file based on what the fixture instantiates.
2. Add the type to the file's local `type` block.
3. Implement using `async ({ deps }, use) => { await use(new Thing(deps)); }`.

## Naming Conventions

- Fixture keys: `camelCase`, named after what the test receives (e.g. `departmentsPage`, `loginSteps`)
- Fixture files: `<layer>.fixtures.ts`

## Before Adding a Fixture

Check:
- Is there already a fixture for this dependency?
- Does it belong in the correct file?
