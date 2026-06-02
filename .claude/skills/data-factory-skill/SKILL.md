---
name: data-factory-skill
description: Use this skill when creating, modifying, or reviewing data factory classes that generate typed test data objects for Playwright tests.
---

## Data Factory Rules

Ground rule: create a new factory only when there is not already one for that domain entity. Reuse and extend existing factories with overrides before creating new ones.

Factories own:
- Generating valid, typed test data objects using `faker`
- Named builder variants for common entity states (e.g. `buildDirection`, `buildService`)
- Payload conversion methods (e.g. `toPayload`) that map internal models to API shapes

Factories do not own:
- API calls or HTTP requests
- UI interactions
- Test assertions or validation logic

## File Location

All factories live under `src/factories/`. One file per domain entity, named `<Entity>Factory.ts`.

Import models from `@/model/<Entity>`.

## Class Structure

- All methods are `static`.
- `build(overrides?)` is the base builder — spreads overrides last so callers can pinpoint any field.
- Named variants (e.g. `buildDirection`) call `build()` with fixed type and a distinct name prefix.
- `toPayload(entity, ...ids)` converts the internal model to the API request shape using a typed enum map.

## Naming Conventions

- Class: `<Entity>Factory`
- Base builder: `build(overrides: Partial<Entity> = {}): Entity`
- Typed variants: `build<Variant>(requiredArgs, overrides?): Entity`
- Payload converter: `toPayload(entity, ...ids): <Create|Update>Payload`

## Unique Names

Always make generated names unique to avoid collisions across parallel test runs using a descriptive prefix:

```ts
name: `Prefix_Variant_${Date.now()}_${faker.string.numeric(6)}`
```

## Override Pattern

Every builder accepts `overrides: Partial<Entity> = {}` spread **after** defaults. Named variants that fix certain fields place those fixed fields **after** overrides so they cannot be accidentally overridden.

## Payload Conversion

Use a typed map (`Record<InternalEnum, ApiEnum>`) for enum translation — never raw strings or switch statements.

## Before Adding a New Factory or Variant

Check:
- Does a factory already exist for this entity?
- Can `build()` + overrides satisfy the new case without a named variant?
- Is the model interface defined under `src/model/`? If not, define it there first.
