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
-   New tests should follow the patterns of existing tests, e.g. no imports.
-   Tests should be auto-run after being written, to ensure they pass.
-   If more log data is needed to debug a test, you can set `DEBUG_TEST=1` in the environment before running the test.

## Test Setup Guidelines

-   Test setup in `beforeEach` functions should have a minimal configuration - don't set player aember if its not needed and don't add extra cards that aren't used by tests.
-   When adding cards for tests, be careful that the card's abilities don't interfere with the card being tested. In particular, be aware of elusive, taunt, and abilities that affect neighbors.
-   Avoid putting `inPlay` cards from a different (inactive) house in the setup unless their interaction is being tested. They raise the risk of accidentally being valid targets and confuse readers.
-   **Never reuse the same card name in two different zones across both players** (e.g. `troll` in `player2.inPlay` and `player1.deck`). The auto-generated `this.troll` then resolves to only one of them and reads ambiguously. If a test genuinely needs both copies, look up each one explicitly via `findCardByName(name, location)` in the test (see existing examples in the codebase).
-   When setting up a test, the `this.setupTest()` function should not be run multiple times. For example in a `describe()` block nested in another `describe()` block, the inner block should not call `this.setupTest()` again - the second setupTest will not be run. Instead, set up the describe block without nesting.

## Modifying Existing Tests

**Never modify or update existing tests unless the user explicitly asks you to.** Tests represent the expected behavior of the code, and changing them without permission can mask bugs or break intentional functionality.

If you believe a test is genuinely incorrect (e.g., it tests for wrong behavior based on game rules, or contradicts card text), explain your reasoning to the user and ask before making changes.

## Test Assertions

-   The end of each test should check that the active player doesn't have any pending prompts, eg `expect(this.player1).isReadyToTakeAction();`
-   Assume that readers of the tests are well versed in the game. Tests only need comments when setting up complex or niche scenarios.
-   The tests should only test the functionality of the card being implemented, not the metadata provided by the JSON data. For example, tests do not need to check the card's house, type, power, armor, traits, or keywords like "taunt" or "elusive", unless the card's ability interacts with those attributes. Tests should focus on the card's unique abilities and effects that are in their text box.
-   **Always use the public getters** (`.damage`, `.amber`, `.powerCounters`, `.exhausted`, `.stunned`, `.warded`, `.enraged`) for assertions and setup. Never read `.tokens.damage` / `.tokens.amber` / `.tokens.power` directly — they return `undefined` when no token is set, while the getters return `0` / `false`.
-   Never use `.toBeUndefined()` on a token-backed value. Assert `.toBe(0)` or `.toBe(false)` against the getter instead.
-   Each test (`it('...')`) description must describe the specific scenario it asserts. Avoid generic descriptions like "works" or just "ability".
-   Cover both **positive and negative** scenarios for every ability, plus **boundary** cases (at-threshold and just over/under) when the ability has a numeric or count condition.
-   When an ability targets, counts, or affects creatures, assert `toBeAbleToSelect` / `not.toBeAbleToSelect` and the resulting state on **every creature in the setup** (friendly + enemy) in battleline order. This catches under- and over-targeting.
-   This rule applies to **negative tests too**. When asserting "ability does nothing", assert the unchanged state (`.damage`, `.power`, `.location`, `.exhausted`, `.amber`) on every creature in the setup, not just one. A single-creature assertion in a negative test silently passes if the ability mistargets a different creature.
-   When testing damage against a creature with **armor**, assert both `.damage` and `.armor` after the event. The damage may be 0 because armor absorbed it (correct) or because the damage event never fired (bug). Asserting `.armor` distinguishes the two.
-   For flank position, use `card.isOnFlank()`. **Avoid `player.player.cardsInPlay`** (and indexing into it) — it leaks battleline implementation details and reads poorly. The only legitimate use is when the test explicitly cares about play-area contents in aggregate (e.g. Doomsday Device counting cards). To verify which cards are in play, assert `.location` on each card by name (`'play area'` vs `'hand'`/`'discard'`/`'deck'`).
-   When testing a gained ability (granted via `ability.effects.gainAbility(...)`), the first test in the describe should explicitly confirm the ability is present — `clickCard` the receiving creature and assert `toHavePromptButton("Use this card's Action ability")` (or the equivalent for the gained ability type) before invoking it. `useAction` will fail with a generic prompt error if the ability is missing.
-   **If a test isn't behaving as expected, check for an active prompt first.** Many spurious failures come from a leftover prompt the test forgot to dismiss. Add `expect(this.<player>).isReadyToTakeAction();` mid-test, or print the current prompt, before suspecting a deeper bug.

### `activePromptTitle` discipline

When implementing a card, prefer the default prompt title generated from the target/game-action. Only set `activePromptTitle` when the default is genuinely ambiguous (e.g. multiple sequential prompts in the same ability that need to be distinguished). When you do need to override, prefer reusing an existing localization string (search [`public/locales/en.json`](../public/locales/en.json)) over coining a new very-specific one — every new title must be added to every locale file. See [docs/card-messages.md](../docs/card-messages.md#using-target).

See [docs/testing-cards.md](../docs/testing-cards.md#coverage-checklist) for the full coverage checklist and examples.
