# Testing Guide

This guide covers writing and running tests for the Keyteki codebase.

## Commands

-   Run all tests: `DEBUG_TEST=1 npm test`
-   Run specific test file: `DEBUG_TEST=1 npm test -- test/server/cards/<Set>/<CardName>.spec.js`
-   Run multiple test files: `DEBUG_TEST=1 npm test -- test/server/cards/<Set1>/<CardName1>.spec.js test/server/cards/<set2>/<CardName2>.spec.js`
-   Run tests matching a pattern: `DEBUG_TEST=1 npm test -- --testNamePattern '<pattern>'`

## Viewing Test Output

**Quick pass/fail check:**

```bash
npm test -- test/server/cards/<Set>/<CardName>.spec.js 2>&1 | tail -5
```

**When tests fail**, don't pipe through `grep` or `tail` - vitest output formatting often breaks when piped. Instead:

-   Run the test without piping to see full output
-   Use `--testNamePattern '<pattern>'` to run only the failing test
-   If output is truncated with "Large tool result written to file", use `read_file` on the output file to see the full results

**DEBUG_TEST=1** produces verbose game logs. Only use it when you need to trace game state, not for checking pass/fail.

## Writing Card Tests

-   Tests should be added to a new `<CardName>.spec.js` file for the card under `test/server/cards/<Set>/<CardName>.spec.js` that corresponds to the card being tested.
    -   Example: [BadOmen.spec.js](server/cards/12-PV/BadOmen.spec.js).
-   **Never create test files outside the `test/` directory** (e.g., in `/tmp/`). The test framework only recognizes files within the project's test directory structure, and external files will not work with the setup helpers.
-   New tests should follow the patterns of existing tests, e.g. no imports.
-   Tests should be auto-run after being written, to ensure they pass.
-   If more log data is needed to debug a test, you can set `DEBUG_TEST=1` in the environment before running the test.

## Test Setup Guidelines

-   Test setup in `beforeEach` functions should have a minimal configuration - don't set player aember if its not needed and don't add extra cards that aren't used by tests.
-   When adding cards for tests, be careful that the card's abilities don't interfere with the card being tested. In particular, be aware of elusive, taunt, and abilities that affect neighbors.
-   When setting up a test, the `this.setupTest()` function should not be run multiple times. For example in a `describe()` block nested in another `describe()` block, the inner block should not call `this.setupTest()` again - the second setupTest will not be run. Instead, set up the describe block without nesting.
-   **Always verify card abilities in the JSON data before writing tests.** Don't assume a card has a particular ability type based on its name - check the actual `"text"` field in `keyteki-json-data/packs/`. For example, Helper Bot has a Play ability (`"Play: ..."`), not a Scrap ability. Brillix Ponder has a Scrap ability (`"Scrap: Draw a card."`). The ability type determines when and how effects trigger.

## Modifying Existing Tests

**Never modify or update existing tests unless the user explicitly asks you to.** Tests represent the expected behavior of the code, and changing them without permission can mask bugs or break intentional functionality.

If you believe a test is genuinely incorrect (e.g., it tests for wrong behavior based on game rules, or contradicts card text), explain your reasoning to the user and ask before making changes.

## Test Assertions

-   The end of each test should check that the active player doesn't have any pending prompts, eg `expect(this.player1).isReadyToTakeAction();`
-   Assume that readers of the tests are well versed in the game. Tests only need comments when setting up complex or niche scenarios.
-   The tests should only test the functionality of the card being implemented, not the metadata provided by the JSON data. For example, tests do not need to check the card's house, type, power, armor, traits, or keywords like "taunt" or "elusive", unless the card's ability interacts with those attributes. Tests should focus on the card's unique abilities and effects that are in their text box.
