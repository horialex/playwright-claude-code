A Playwright test needs to be run up to a `page.pause()` breakpoint, after which the agent takes over to complete the test.

## Context provided by the user

$ARGUMENTS

## Your task

1. First, try to attach to an already-paused browser:
   ```bash
   playwright-cli attach --cdp=http://localhost:9222
   ```
   - If this **succeeds**, the browser is already running and paused — skip to step 3.
   - If this **fails**, the browser is not running — proceed to step 2.

2. Run the test using the local config. Use the file and test title from the arguments if provided:
   ```bash
   # If a specific test title was given:
   npx playwright test [TEST_FILE] --project=chromium-local --headed --grep "[TEST_TITLE]"

   # If only a file was given (runs all tests in the file):
   npx playwright test [TEST_FILE] --project=chromium-local --headed
   ```
   Wait for the browser to pause at `page.pause()` before proceeding.

3. Attach to the live browser:
   ```bash
   playwright-cli attach --cdp=http://localhost:9222
   playwright-cli snapshot
   ```

3. Explore the current page state — take additional snapshots or interact with elements as needed to understand what's on screen.

3. Write the remaining test steps based on what you observe, using the appropriate skill for each layer:
   - Use **test-writer-skill** to write the test spec
   - Use **pom-skill** to create or update Page Objects (`src/pages/`)
   - Use **ui-steps-skill** to create or update UI Steps (`src/steps/ui/`)
   - Use **api-service-skill** to create or update API service methods (`src/api/`)

4. Generate locators using `playwright-cli generate-locator` rather than guessing selectors.

5. Return the completed test code and any new page object / steps / service methods needed, ready to replace `page.pause()`.
