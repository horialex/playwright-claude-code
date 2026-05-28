---
name: pom-skill
description: Use this skill when creating or modifying Page Object Models
---


## POM Rules
Ground rule: Create a new page object only when there isn't one for that page or section of the page

Page objects own:
- All page objects must inherit `BasePage`
- Locators
- Low-level page actions
- Page/component state helpers

Page objects do not own:
- Full business workflows
- API calls
- Test data creation
- Test scenario logic
- Validation logic

## Locator Strategy

Prefer:
1. `getByTestId`
2. `getByRole`
3. `getByLabel`
4. `getByPlaceholder`
5. `getByText`
6. CSS only if necessary
7. XPath only as a last resort


## Method Style

Use clear, small methods.

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
