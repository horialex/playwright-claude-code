---
name: ui-steps-skill
description: Create business-level UI steps that compose Page Object Model actions.
---

Use this skill when creating or modifying UI step files.
They live under `src/steps/ui`


## UI Step Purpose

UI steps represent business-readable user actions.
They should combine page object methods into meaningful flows.

## UI Step Rules

UI steps should:
- Use Page Object Models for UI interaction.
- Have business-readable method names.
- Keep flows focused.
- Accept typed data from factories.
- Return useful domain results only when needed.
- Every public method wraps its work in `test.step()`:

UI steps should not:
- Contain raw locators.
- Contain API endpoint logic.
- Generate complex test data internally.
- Hide important assertions unless the project uses assertion steps.
- Become large scripts with many unrelated actions.


## When Creating a Step

1. Check existing steps.
2. Reuse existing POM methods.
3. Add missing POM methods only if needed.
4. Keep the step name aligned with user behavior.
5. Keep assertions separate unless existing convention says otherwise.
