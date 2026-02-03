# Testing Cards

This document explains how to write tests for cards.

## Table of Contents

-   [Overview](#overview)
-   [Test File Structure](#test-file-structure)
-   [Setting Up Tests](#setting-up-tests)
    -   [setupTest Options](#setuptest-options)
    -   [Card State Setup](#card-state-setup)
    -   [Recommended Test Creatures](#recommended-test-creatures)
    -   [Moving Cards Between Zones](#moving-cards-between-zones)
    -   [Changing a Card's House](#changing-a-cards-house)
-   [Player Actions](#player-actions)
    -   [Playing Cards](#playing-cards)
    -   [Using Cards](#using-cards)
    -   [Responding to Prompts](#responding-to-prompts)
    -   [Prophecy Cards](#prophecy-cards)
    -   [Tide Manipulation](#tide-manipulation)
-   [Assertions](#assertions)
    -   [Prompt Assertions](#prompt-assertions)
    -   [Card Selection Assertions](#card-selection-assertions)
    -   [Card State Assertions](#card-state-assertions)
    -   [Player State Assertions](#player-state-assertions)
    -   [Chat Log Assertions](#chat-log-assertions)
-   [Card References](#card-references)
    -   [Basic Examples](#basic-examples)
    -   [Numbers in Card IDs](#numbers-in-card-ids)
    -   [Cards Starting with Numbers](#cards-starting-with-numbers)
    -   [Apostrophes in Card Names](#apostrophes-in-card-names)
    -   [Multiple Copies of the Same Card](#multiple-copies-of-the-same-card)
    -   [Gigantic Cards (Two-Part Cards)](#gigantic-cards-two-part-cards)
    -   [Finding Cards Explicitly](#finding-cards-explicitly)
-   [Common Patterns](#common-patterns)
    -   [Testing Play Abilities](#testing-play-abilities)
    -   [Testing Reap Abilities](#testing-reap-abilities)
    -   [Testing Fight Abilities](#testing-fight-abilities)
    -   [Testing Destroyed Abilities](#testing-destroyed-abilities)
    -   [Testing Action Abilities](#testing-action-abilities)
    -   [Testing Persistent Effects](#testing-persistent-effects)
    -   [Testing "Cannot" Restrictions](#testing-cannot-restrictions)
    -   [Testing Multiple Describe Blocks](#testing-multiple-describe-blocks)
-   [Running Tests](#running-tests)
-   [Testing UI changes](#testing-ui-changes)
    -   [Starting the Server](#starting-the-server)
    -   [Adding Cards to Test](#adding-cards-to-test)
    -   [Updating Card Data](#updating-card-data)
-   [Debugging Tests](#debugging-tests)
    -   [Enable Debug Output](#enable-debug-output)
    -   [Common Issues](#common-issues)
    -   [Inspecting State](#inspecting-state)

## Overview

Tests are located in `test/server/cards/<Set>/<CardName>.spec.js`, mirroring the card implementation structure. Tests use Jasmine and a custom test harness that simulates game state.

**Key principles:**

-   Tests should focus on the card's unique abilities, not metadata (house, power, armor, keywords)
-   Keep `beforeEach` setup minimal - only include values like cards or aember that are needed for the tests
-   End each test by verifying the player has no pending prompts: `expect(this.player1).isReadyToTakeAction()`
-   For longer tests, add comments explaining what each test is setting up

## Test File Structure

```javascript
describe('Card Name', function () {
    describe("Card Name's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['card-name'],
                    inPlay: ['helper-creature']
                },
                player2: {
                    inPlay: ['enemy-creature']
                }
            });
        });

        it('should do something specific', function () {
            // Test implementation
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
```

## Setting Up Tests

### setupTest Options

```javascript
this.setupTest({
    player1: {
        house: 'brobnar', // Active house for player1
        hand: ['card-id'], // Cards in hand
        inPlay: ['creature-id'], // Cards in play (creatures/artifacts)
        discard: ['card-id'], // Cards in discard pile
        archives: ['card-id'], // Cards in archives
        amber: 5, // Starting aember
        keys: 1, // Forged keys (0-2)
        chains: 0, // Chains
        prophecies: ['card-id'], // Prophecy cards (PV set)
        token: 'token-card-id' // Token creature template
    },
    player2: {
        // Same options
    }
});
```

**Flank positioning:** The order of creatures in the `inPlay` array determines their board position. The first creature is on the left flank, and the last creature is on the right flank. When testing flank-related abilities, play creatures to move others off flanks rather than using `moveCard`.

```javascript
// creature-left is on left flank, creature-right is on right flank, creature-middle is in the middle
inPlay: ['creature-left', 'creature-middle', 'creature-right'];
```

**Choosing test cards:** When selecting cards for `hand`, `inPlay`, or `discard`, check the JSON data for any cards that will be played or used during the test. Cards may have aember bonuses, keywords (taunt, elusive, etc.), power values, or abilities that interfere with assertions. Use `jq '.cards[] | select(.id == "card-id") | {id, amber, power, keywords, text}' keyteki-json-data/packs/*.json` to verify a card's properties before using it.

### Card State Setup

After `setupTest`, you can modify card state. The Card class provides convenient getters/setters for common token types:

```javascript
beforeEach(function () {
    this.setupTest({
        /* ... */
    });

    // Exhaust a creature
    this.myCreature.exhausted = true;

    // Ready a creature
    this.myCreature.ready();

    // Add damage tokens
    this.myCreature.damage = 3;

    // Add power counters
    this.myCreature.powerCounters = 2;

    // Add aember to a creature
    this.myCreature.amber = 2;

    // Stun a creature
    this.myCreature.stun();

    // Unstun a creature
    this.myCreature.unstun();

    // Ward a creature
    this.myCreature.ward();

    // Remove ward
    this.myCreature.unward();

    // Enrage a creature
    this.myCreature.enrage();

    // Remove enrage
    this.myCreature.unenrage();

    // Set player aember
    this.player1.amber = 6;
    this.player2.amber = 3;
});
```

### Recommended Test Creatures

When writing tests, use creatures with minimal abilities to avoid unintended interactions. Creatures with keywords like Elusive, Taunt, or abilities can interfere with the card being tested. Use Brobnar creatures as a first choice.

**Recommended creatures by house:**

| House        | Creature               | Notes                                            |
| ------------ | ---------------------- | ------------------------------------------------ |
| Brobnar      | `troll`                | 8 power, Reap: heal 3 damage                     |
| Brobnar      | `groggins`             | 8 power, can only attack flank creatures         |
| Brobnar      | `honored-battlemaster` | 4 power, Action:                                 |
| Dis          | `pit-demon`            | 5 power, Action:                                 |
| Dis          | `hystricog`            | 4 power, Action:                                 |
| Dis          | `snarette`             | 4 power, captures at end of turn, Action:        |
| Ekwidon      | `antiquities-dealer`   | 3 power, Action:                                 |
| Ekwidon      | `gemcoat-vendor`       | 6 power, Action:                                 |
| Ekwidon      | `pen-pal`              | 5 power, Action:                                 |
| Geistoid     | `shadys`               | 5 power, Action:                                 |
| Geistoid     | `helichopper`          | 5 power, +power if haunted, Action:              |
| Geistoid     | `echofly`              | 2 power, 1 armor, Action:                        |
| Logos        | `even-ivan`            | 4 power, Action:                                 |
| Logos        | `odd-clawde`           | 5 power, Action:                                 |
| Logos        | `novu-archaeologist`   | 4 power, Action:                                 |
| Mars         | `yxlix-mesmerist`      | 5 power, Action:                                 |
| Mars         | `green-aeronaut`       | 3 power, Action:                                 |
| Mars         | `white-aeronaut`       | 3 power, Action:                                 |
| Redemption   | `even-ivan`            | 4 power, Action:                                 |
| Redemption   | `odd-clawde`           | 5 power, Action:                                 |
| Redemption   | `dark-centurion`       | 5 power, Action:                                 |
| Sanctum      | `abond-the-armorsmith` | 3 power, other creatures +1 armor, Action:       |
| Sanctum      | `lady-maxena`          | 5 power, 2 armor, Play: stun, Action:            |
| Sanctum      | `protectrix`           | 5 power, Reap: heal and protect creature         |
| Saurian      | `dark-centurion`       | 5 power, Action:                                 |
| Saurian      | `cornicen-octavia`     | 5 power, 1 armor, Action:                        |
| Saurian      | `eclectic-ambrosius`   | 4 power, knowledge counters, Action:             |
| Shadows      | `lamindra`             | 1 power, Elusive; good fight target for testing Fight: abilities |
| Shadows      | `yantzee-gang`         | 5 power, Action:                                 |
| Shadows      | `hobnobber`            | 3 power, Action:                                 |
| Skyborn      | `redhawk`              | 3 power, Action:                                 |
| Skyborn      | `bux-bastian`          | 3 power, Scrap: exalt enemy flank creature       |
| Skyborn      | `scalawag-finn`        | 6 power, After Fight: heal 3                     |
| StarAlliance | `ensign-el-samra`      | 3 power, Action:                                 |
| StarAlliance | `crewman-jörg`         | 3 power, Action:                                 |
| StarAlliance | `ambassador-liu`       | 4 power, Action:                                 |
| Unfathomable | `flamegill-enforcer`   | 6 power, enrages on tide raise, Action:          |
| Unfathomable | `rustmiser`            | 5 power, Reap: exhaust artifacts                 |
| Unfathomable | `bubbles`              | 5 power, Play: return creature to deck           |
| Untamed      | `mighty-tiger`         | 4 power, Play: deal 4 damage                     |
| Untamed      | `witch-of-the-dawn`    | 3 power, Play: return creature from discard      |
| Untamed      | `conclave-witch`       | 3 power, Action:                                 |

**Avoid** using creatures with abilities or keywords unless those abilities/keywords are being specifically tested. When using a creature with an ability or keyword, make sure to account for its effects in your test assertions:

-   **Aember bonus** - Gains aember when played, interferes with aember counting
-   **Persistent effects** - Should be completely avoided unless needed to test in combination with the card being tested
-   **Taunt** - Forces fights to target them
-   **Elusive** - Avoids damage from first fight
-   **Assault/Hazardous** - Deals extra damage
-   **Destroyed/Fight/Reap abilities** - May trigger unexpectedly
-   **Armor** - Interferes with damage testing
-   **Play abilities** - Fine for creatures that are used for `inPlay` setup, but avoid for creatures being played during the test
-   **Action/Omni** - These are great because they don't interfere with other actions like Reap/Fight

### Moving Cards Between Zones

Use `moveCard` to move cards between locations during test setup or mid-test:

```javascript
beforeEach(function () {
    this.setupTest({
        player1: {
            house: 'logos',
            hand: ['dust-pixie', 'full-moon'],
            discard: ['hunting-witch']
        }
    });

    // Move a card from hand to deck (e.g., to test drawing)
    this.player1.moveCard(this.dustPixie, 'deck');

    // Move a card from discard to play area
    this.player1.moveCard(this.huntingWitch, 'play area');

    // Move a card to archives
    this.player1.moveCard(this.fullMoon, 'archives');
});
```

Valid locations: `'hand'`, `'deck'`, `'discard'`, `'play area'`, `'archives'`, `'purged'`

You can also move cards mid-test:

```javascript
it('should work when card is in discard', function () {
    // Move card to discard before testing
    this.player1.moveCard(this.myCard, 'discard');

    // Now test behavior that interacts with discard
    this.player1.play(this.exhume);
    // ...
});
```

### Changing a Card's House

Some tests need to change a card's house (e.g., when testing house-specific interactions). Use the `makeMaverick` helper:

```javascript
beforeEach(function () {
    this.setupTest({
        player1: {
            house: 'saurian',
            hand: ['tachyon-manifold']
        }
    });

    // Change the card's house to match the active house
    this.player1.makeMaverick(this.tachyonManifold, 'saurian');
});
```

## Player Actions

### Playing Cards

```javascript
// Play a creature (defaults to right flank)
this.player1.playCreature(this.myCreature);

// Play a creature to left flank
this.player1.playCreature(this.myCreature, true);

// Play a creature with deploy (can choose position)
this.player1.playCreature(this.myCreature, false, true);

// Play an action card
this.player1.play(this.myAction);

// Play an artifact
this.player1.play(this.myArtifact);

// Play an upgrade on a creature
this.player1.playUpgrade(this.myUpgrade, this.targetCreature);
```

**Note:** Prefer using `playCreature()` for playing creatures, not `play()`. The `playCreature()` method handles card selection and flank positioning prompts with default values, while `play()` requires manually handling these aspects.

### Using Cards

```javascript
// Reap with a creature
this.player1.reap(this.myCreature);

// Fight with a creature
this.player1.fightWith(this.myCreature, this.enemyCreature);

// Use an Action ability (artifact or creature)
this.player1.useAction(this.myArtifact);

// Use an Omni ability (preferred method)
this.player1.useOmni(this.myCard);

// Discard a card (scrap)
this.player1.scrap(this.myCard);
```

### Responding to Prompts

```javascript
// Click a button in a prompt
this.player1.clickPrompt('Yes');
this.player1.clickPrompt('No');
this.player1.clickPrompt('Done');

// Select a card as a target
this.player1.clickCard(this.targetCreature);

// Select a house
this.player1.clickPrompt('brobnar');

// End turn
this.player1.endTurn();
```

### Prophecy Cards

```javascript
// Activate a prophecy with a fate card
this.player1.activateProphecy(this.badOmen, this.fateCard);
```

### Tide Manipulation

```javascript
// Raise the tide (gains 3 chains)
this.player1.raiseTide();

// Lower the tide (no chains)
this.player1.lowerTide();

// Check tide state
expect(this.player1.isTideHigh()).toBe(true);
expect(this.player1.isTideLow()).toBe(true);
expect(this.player1.isTideNeutral()).toBe(true);
```

## Assertions

### Prompt Assertions

```javascript
// Check player has a specific prompt
expect(this.player1).toHavePrompt('Card Name');
expect(this.player1).toHavePrompt('Choose a creature');

// Check player has a specific button
expect(this.player1).toHavePromptButton('Yes');
expect(this.player1).toHavePromptButton('Sacrifice Card Name');

// Check player is ready to take normal turn actions
expect(this.player1).isReadyToTakeAction();
```

### Card Selection Assertions

```javascript
// Check if a card can be selected as a target
expect(this.player1).toBeAbleToSelect(this.myCreature);
expect(this.player1).not.toBeAbleToSelect(this.friendlyCreature);

// Check if a card can be played
expect(this.player1).toBeAbleToPlay(this.myCard);
expect(this.player1).not.toBeAbleToPlay(this.wrongHouseCard);
```

### Card State Assertions

```javascript
// Check card location
expect(this.myCard.location).toBe('play area');
expect(this.myCard.location).toBe('discard');
expect(this.myCard.location).toBe('hand');
expect(this.myCard.location).toBe('deck');
expect(this.myCard.location).toBe('archives');
expect(this.myCard.location).toBe('purged');

// Check damage (using getter - returns 0 if no damage token)
expect(this.myCreature.damage).toBe(3);
expect(this.myCreature.damage).toBe(0);

// Check power counters
expect(this.myCreature.powerCounters).toBe(2);

// Check exhausted state
expect(this.myCreature.exhausted).toBe(true);
expect(this.myCreature.exhausted).toBe(false);

// Check stunned/warded/enraged
expect(this.myCreature.stunned).toBe(true);
expect(this.myCreature.warded).toBe(true);
expect(this.myCreature.enraged).toBe(true);

// Check aember on card
expect(this.myCreature.amber).toBe(2);

// Check controller
expect(this.myCreature.controller).toBe(this.player1.player);
expect(this.myCreature.controller).toBe(this.player2.player);
```

### Player State Assertions

```javascript
// Check aember
expect(this.player1.amber).toBe(5);

// Check keys
expect(this.player1.player.keys.red).toBe(true);
expect(this.player1.player.keys.blue).toBe(false);
expect(this.player1.player.keys.yellow).toBe(false);

// Check chains
expect(this.player1.chains).toBe(3);

// Check current key cost (note: use this.player1.player, not this.player1)
expect(this.player1.player.getCurrentKeyCost()).toBe(5);
```

### Chat Log Assertions

```javascript
// Check recent chat message
expect(this.game).toHaveRecentChatMessage('steals 1 amber');
expect(this.game).toHaveRecentChatMessage('deals 3 damage', 2); // 2 messages back
```

## Card References

Cards are automatically assigned to `this.<camelCaseName>` based on their ID. The conversion splits on hyphens and capitalizes each segment after the first.

### Basic Examples

```javascript
// Card ID: 'mighty-tiger' → this.mightyTiger
// Card ID: 'dust-pixie' → this.dustPixie
// Card ID: 'bad-omen' → this.badOmen
```

### Numbers in Card IDs

Numbers are kept as-is and the following segment is capitalized:

```javascript
// Card ID: 'boosted-b4-rry' → this.boostedB4Rry
// (Note: numbers like "4" stay, next letter "r" becomes "R")
```

### Cards Starting with Numbers

Cards that start with numbers can't be valid JavaScript identifiers, so use `findCardByName`:

```javascript
// Card ID: '1-2-punch' - cannot use this.12Punch (invalid JS)
// Instead, manually assign in beforeEach:
this.punch = this.player1.findCardByName('1-2-punch');
```

### Apostrophes in Card Names

Apostrophes in card names become hyphens in the ID, which then get camelCased:

```javascript
// Card name: "They're Everywhere"
// Card ID: 'they-re-everywhere' → this.theyReEverywhere

// Card name: "Khrkhar's Blaster"
// Card ID: 'khrkhars-blaster' → this.khrkharsBlaster
```

### Multiple Copies of the Same Card

When you have multiple copies of the same card, list it multiple times and then manually assign references:

```javascript
beforeEach(function () {
    this.setupTest({
        player1: {
            house: 'shadows',
            inPlay: ['shadow-self', 'urchin'],
            hand: ['shadow-self']
        }
    });

    // Manually assign copies by finding them in specific locations
    this.shadowSelf1 = this.player1.findCardByName('shadow-self', 'play area');
    this.shadowSelf2 = this.player1.findCardByName('shadow-self', 'hand');
});
```

### Gigantic Cards (Two-Part Cards)

Gigantic creatures like Deusillus and Ultra Gravitron require both parts to play. The second part uses a `2` suffix in its ID:

```javascript
this.setupTest({
    player1: {
        house: 'saurian',
        hand: ['deusillus', 'deusillus2'] // Part 1 and Part 2
    }
});

// Access them as:
this.deusillus; // Part 1
this.deusillus2; // Part 2

// Both parts must be available to play the gigantic creature
this.player1.playCreature(this.deusillus);
```

**After playing:** The clicked part goes into play, and the other part becomes a "composed part" attached to it. Note that checking the attached part's location may return unexpected values (e.g., `'hand'` instead of `'play area'`). When testing gigantics, check the played card's state rather than the other half.

### Finding Cards Explicitly

You can also find cards explicitly when auto-naming doesn't work:

```javascript
// Find by name
let card = this.player1.findCardByName('mighty-tiger');

// Find in specific location
let card = this.player1.findCardByName('dust-pixie', 'hand');
let card = this.player1.findCardByName('troll', 'play area', 'opponent');
```

## Common Patterns

### Testing Play Abilities

```javascript
it('should gain 2 aember on play', function () {
    this.player1.play(this.dustPixie);
    expect(this.player1.amber).toBe(2);
    expect(this.player1).isReadyToTakeAction();
});
```

### Testing Reap Abilities

```javascript
it('should steal 1 when reaping', function () {
    this.player2.amber = 3;
    this.player1.reap(this.urchin);
    expect(this.player1.amber).toBe(1);
    expect(this.player2.amber).toBe(2);
    expect(this.player1).isReadyToTakeAction();
});
```

### Testing Fight Abilities

```javascript
it('should deal 2 damage to a creature on fight', function () {
    this.player1.fightWith(this.bumpsy, this.troll);
    expect(this.troll.damage).toBe(7);
    expect(this.player1).isReadyToTakeAction();
});
```

### Testing Destroyed Abilities

```javascript
it('should gain 2 aember when destroyed', function () {
    this.player1.fightWith(this.myCreature, this.strongEnemy);
    expect(this.myCreature.location).toBe('discard');
    expect(this.player1.amber).toBe(2);
});
```

### Testing Action Abilities

```javascript
it('should ready and fight with a creature', function () {
    this.dextre.exhausted = true;
    this.player1.useAction(this.gauntletOfCommand);
    expect(this.player1).toHavePrompt('Choose a creature');
    this.player1.clickCard(this.dextre);
    expect(this.player1).toHavePrompt('Choose a creature to attack');
    this.player1.clickCard(this.emberImp);
    expect(this.emberImp.location).toBe('discard');
    expect(this.player1).isReadyToTakeAction();
});
```

### Testing Persistent Effects

```javascript
it('should prevent opponent from playing more than 2 cards', function () {
    // Assume Control the Weak is in play
    this.player1.endTurn();
    this.player2.clickPrompt('logos');

    // Play first card
    this.player2.play(this.card1);
    expect(this.player2).toBeAbleToPlay(this.card2);

    // Play second card
    this.player2.play(this.card2);
    expect(this.player2).not.toBeAbleToPlay(this.card3);
});
```

### Testing "Cannot" Restrictions

```javascript
it('should prevent creature from reaping', function () {
    expect(this.player1).not.toBeAbleToSelect(this.stunnedCreature);
    // or test by trying and checking nothing happens
});
```

### Testing Multiple Describe Blocks

Use separate `describe` blocks for different scenarios:

```javascript
describe('Card Name', function () {
    describe('when opponent has creatures', function () {
        beforeEach(function () {
            this.setupTest({
                player1: { house: 'brobnar', inPlay: ['card-name'] },
                player2: { inPlay: ['enemy-creature'] }
            });
        });

        it('should do X', function () {
            /* ... */
        });
    });

    describe('when opponent has no creatures', function () {
        beforeEach(function () {
            this.setupTest({
                player1: { house: 'brobnar', inPlay: ['card-name'] },
                player2: {}
            });
        });

        it('should do Y instead', function () {
            /* ... */
        });
    });
});
```

## Running Tests

```bash
# Run all tests
DEBUG_TEST=1 npm test

# Run specific test file
DEBUG_TEST=1 npm test -- test/server/cards/PV/BadOmen.spec.js

# Run multiple test files
DEBUG_TEST=1 npm test -- test/server/cards/PV/BadOmen.spec.js test/server/cards/CotA/MightyTiger.spec.js

# Run tests matching a pattern (slower - prefer specifying files)
DEBUG_TEST=1 npm test -- --filter='Bad Omen'
```

## Testing UI changes

Use the following to manually test a card in the game - this is usually only needed for UI changes:

### Starting the Server

```bash
# Using Docker (simpler, slow to rebuild)
docker-compose up --build

# Or with hybrid setup (hot reloading)
docker-compose up -d redis postgres
# Configure `config/default.json5` for the server to use the containerized DBs (see docs/local-development.md)
npm start
# In another terminal:
npm run game
```

Visit [http://localhost:4000](http://localhost:4000) and log in with test users (`test0`/`test1`, password: `password`).

### Adding Cards to Test

-   Create a game and start it
-   Enter manual mode (click the manual mode button or use `/manual`)
-   Add your card to hand:

    ```text
    /add-card Card Name
    ```

-   Test the card's interactions

### Updating Card Data

If your card doesn't appear or has wrong data:

```bash
# Docker
docker compose exec lobby node server/scripts/fetchdata

# Non-Docker
node server/scripts/fetchdata.js
```

Restart the server after fetchdata completes.

## Debugging Tests

### Enable Debug Output

Set `DEBUG_TEST=1` to print the game log after each test:

```bash
DEBUG_TEST=1 npm test -- test/server/cards/PV/BadOmen.spec.js
```

This outputs the full game log showing all actions taken, which helps identify where things went wrong.

### Common Issues

-   **Couldn't click on X** - The button or prompt you're looking for doesn't exist. Check `this.formatPrompt()` or enable DEBUG_TEST to see current state.

-   **Cannot end turn now** - Player has a pending prompt that must be resolved first.

-   **Card not found** - Check the card ID matches the JSON data. Card references use camelCase of the ID.

-   **Wrong controller** - Remember cards default to player1 unless specified otherwise in setup.

### Inspecting State

```javascript
// Print current prompt
console.log(this.player1.formatPrompt());

// Print card actions
this.player1.checkActions(this.myCard);

// Get chat logs
console.log(this.game.getPlainTextLog());
```
