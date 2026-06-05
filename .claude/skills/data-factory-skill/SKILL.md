---
name: data-factory-skill
description: Use this skill any time data factories are involved — including creating, modifying, or reviewing test data builders. This includes generating typed test data, adding or refining builder methods, creating named variants, handling overrides, or mapping models to API payloads. Trigger whenever the user mentions factories, test data generation, faker usage, or typed data builders. If test data structure or generation logic is being defined or changed, use this skill.
---

## Purpose

Data factories generate **predictable, typed test data** for tests.  
They provide a consistent way to build domain objects without duplicating setup logic.

## Responsibilities

Factories should:
- Generate **valid, typed domain objects** using `faker`
- Provide a **base builder** (`build`) with override support
- Expose **named variants** for common states
- Handle **model → API payload mapping** (`toPayload`)

## Boundaries

Factories must not:
- Perform **API calls or HTTP requests**
- Contain **UI interactions**
- Include **test assertions or validation logic**

## File Location

- All factories live under `src/factories/`
- One file per entity: `<Entity>Factory.ts`
- Models are imported from `@/model/<Entity>`

## Class Structure

- All methods are `static`
- `build(overrides?)` is the base builder (overrides applied last)
- Named variants call `build()` with predefined values
- `toPayload(entity, ...ids)` maps models to API request shapes

## Naming Conventions

- Class: `<Entity>Factory`
- Base builder: `build(overrides: Partial<Entity> = {}): Entity`
- Variants: `build<Variant>(..., overrides?): Entity`
- Payload: `toPayload(entity, ...ids): <Create|Update>Payload`

## Unique Data

Ensure generated values are unique to avoid collisions in parallel runs:

```ts
name: `Prefix_Variant_${Date.now()}_${faker.string.numeric(6)}`
