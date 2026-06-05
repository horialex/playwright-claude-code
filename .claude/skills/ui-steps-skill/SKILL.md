---
name: ui-steps-skill
description: Use this skill when you are asked to create and maintain business-level UI step definitions that orchestrate Page Object Model actions into meaningful user flows.
---

Use this skill when creating or updating UI step files located in `src/steps/ui`.


## Purpose

UI steps represent **business-level user behavior**, not low-level UI interaction.  
They act as a bridge between test scenarios and Page Object Models by composing reusable UI actions into clear, domain-relevant flows.

## Responsibilities

UI steps should:
- Orchestrate **Page Object Model (POM)** methods into meaningful user actions.
- Expose **business-readable methods** (e.g. `createAccount`, `placeOrder`).
- Keep flows **focused and cohesive** (one responsibility per method).
- Accept **typed input data** (e.g. from factories or fixtures).
- Return **useful domain-level results** only when necessary.
- Wrap each public method in `test.step()` for traceability.

## Boundaries

UI steps must not:
- Use **raw selectors or locators** (this belongs in POMs).
- Contain **API logic or network calls**.
- Generate **complex test data internally**.
- Mix **multiple unrelated flows** in a single method.
- Hide critical assertions (unless using dedicated assertion steps).



## When Creating a Step

1. Check existing steps.
2. Reuse existing POM methods.
3. Add missing POM methods only if needed.
4. Keep the step name aligned with user behavior.
5. Keep assertions separate unless existing convention says otherwise.

## Design Principle

UI steps should read like **user actions in plain English**, while remaining thin orchestration layers over POMs.