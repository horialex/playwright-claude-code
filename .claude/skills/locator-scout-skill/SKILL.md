---
name: locator-scout-skill
description: Use this skill whenever you need to discover, verify, or generate Playwright locators for UI elements — especially when building or updating Page Object Models. This skill drives playwright-cli against the live app to take accessibility snapshots, inspect element attributes, and produce the most resilient semantic locator for each target element. Trigger when: you don't already know the locator for an element, you're adding new methods to a page object, a locator needs verifying against the real DOM, or you need to decide the best selector strategy for an element. Always use this skill before guessing at a selector or hardcoding a CSS path.
---

## Purpose

Reliable page objects start with reliable locators. This skill uses `playwright-cli` to inspect the live application and produce the most resilient, semantic locator for each element — using the same priority order enforced by the `pom-skill`.

Use this skill as a **discovery step** before writing or updating a page object method.

## Locator Priority

Work down this list and use the highest-priority option that uniquely identifies the element:

1. `getByTestId` — most stable; use when a `data-testid` attribute is present
2. `getByRole` — semantic and resilient; preferred for interactive elements (buttons, links, inputs, dialogs)
3. `getByLabel` — best for form fields associated with a visible `<label>`
4. `getByPlaceholder` — for inputs identified by placeholder text
5. `getByText` — for static text that is stable and unique
6. CSS selector — only when no semantic option applies
7. XPath — last resort

## Workflow

### Step 1 — Navigate to the relevant page

```bash
playwright-cli open <BASE_URL>/<route>
```

If the page requires authentication, complete the login flow first or load a saved auth state before navigating.

### Step 2 — Snapshot the page

```bash
playwright-cli snapshot
```

Read the accessibility tree to understand element structure and note refs (e.g. `e3`, `e12`).

For large pages, scope the snapshot to the relevant region:

```bash
playwright-cli snapshot e12   # snapshot subtree rooted at e12
playwright-cli snapshot --depth=4   # limit depth for efficiency
```

### Step 3 — Check for data-testid first

Before using any other locator strategy, check whether the element has a `data-testid`:

```bash
playwright-cli eval "el => el.getAttribute('data-testid')" e7
```

If the result is non-null → use `page.getByTestId('<value>')` and stop here.

### Step 4 — If no testid, generate the best semantic locator

```bash
playwright-cli --raw generate-locator e7
```

This outputs a ready-to-use Playwright locator expression. Check it against the priority list above. If `generate-locator` returns a CSS path, inspect the element further:

```bash
playwright-cli eval "el => el.id" e7
playwright-cli eval "el => el.getAttribute('aria-label')" e7
playwright-cli eval "el => el.getAttribute('role')" e7
playwright-cli eval "el => el.className" e7
```

Use these attributes to manually construct a higher-priority locator (e.g. `getByRole`) if `generate-locator` fell back to CSS.

### Step 5 — Verify uniqueness

Confirm the locator matches exactly one element:

```bash
# For data-testid
playwright-cli eval "document.querySelectorAll('[data-testid=\"my-id\"]').length"

# For role + name
playwright-cli eval "document.querySelectorAll('[role=\"button\"]').length"
```

If more than one element matches, add a more specific qualifier (e.g. scope to a parent, add a `name` option to `getByRole`).

### Step 6 — If the element requires interaction to appear

Some elements are only visible after a user action (modal, dropdown, tooltip). Trigger the action first, then snapshot:

```bash
playwright-cli click e5          # open the modal / dropdown
playwright-cli snapshot          # now inspect the newly visible elements
playwright-cli generate-locator e9
```

### Step 7 — Return the locator

Produce the final TypeScript expression, ready to paste into the page object:

```typescript
// data-testid (highest priority)
this.page.getByTestId('submit-btn')

// role + accessible name
this.page.getByRole('button', { name: 'Save' })

// label
this.page.getByLabel('Email address')

// placeholder
this.page.getByPlaceholder('Search departments...')

// text
this.page.getByText('No results found')
```

## Tips

- Run `playwright-cli eval "el => el.outerHTML" e5` to see the raw HTML when attributes are unclear
- Use `playwright-cli --raw generate-locator e5` for clean output with no extra text
- When scoping a locator to a specific region (e.g. inside a table row), note the parent ref and mention it in the POM method using `.locator()` chaining
- After discovering locators, close the session: `playwright-cli close`
