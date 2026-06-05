---
name: pom-skill
description: Use this skill any time Page Object Models (POMs) are involved - including creating, modifying, or reviewing UI interaction layers. This includes defining or updating page objects, managing locators, implementing low-level UI actions, building reusable components, refactoring POM methods, or improving selector strategy. Trigger whenever the user mentions page objects, locators, selectors, BasePage patterns, or Playwright UI structure. If UI interaction logic or structure is being defined or changed, use this skill.
---


## Purpose

Page Object Models (POMs) represent the **structure and mechanics of the UI**, not user intent.  
They provide a stable abstraction over the DOM and expose reusable, low-level actions.

POMs are the foundation used by **UI steps**, not a place for business logic.

## Responsibilities

Page objects should:
- Own **locators**.
- Encapsulate **UI interactions** (clicks, fills, selections).
- Provide **small, reusable methods**.
- Expose **state/query helpers** (e.g. `isLoaded`, `getErrorMessage`).
- Represent either:
  - A full page, or
  - A reusable page component/section.

All page objects must inherit from `BasePage`.

## Boundaries

Page objects must not:
- Implement **business workflows** (belongs in UI steps).
- Contain **API logic**.
- Create **test data**.
- Include **test scenario logic**.
- Perform **assertions**.

## Locator Strategy

Prefer resilient, semantic locators in this order:
1. `getByTestId`
2. `getByRole`
3. `getByLabel`
4. `getByPlaceholder`
5. `getByText`
6. CSS (only if necessary)
7. XPath (last resort)


## Method Style

Use clear, small methods that describe one page-level action or query.

Good examples:
- `fillEmail(email: string)`
- `clickSave()`
- `selectRole(role: UserRole)`
- `openUserMenu()`
- `getValidationMessage()`
- `isLoaded()`

Avoid:
- `doLoginStuff()`
- `clickFirstButton()`
- `completeEntireCheckoutFlow()`
- `createUserViaApi()`


## Before Adding Locators

Check:
- Does this page/component object already exist?
- Is there an existing locator?
- Can a semantic locator be used?

If the locator for an element is not already known, **use the `locator-scout-skill`** before writing anything. It will navigate the live app, inspect the element's attributes, and return the best semantic locator following the priority order above. Do not guess selectors or hardcode CSS paths without checking the real DOM first.


## Reuse Guidelines

Before adding anything:
1. Check if the page/component already exists.
2. Reuse existing locators and methods.
3. Prefer extending an existing object over creating a new one.
4. Extract reusable components when duplication appears.

## Design Principle

POMs should model **how the UI works**, not **what the user is trying to achieve**.  
If a method starts to read like a user goal, it likely belongs in a UI step instead
