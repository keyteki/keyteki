# Message Tests

This directory contains tests for game log messages. These tests verify that the correct messages are displayed to players during gameplay, and to detect changes to log messages as the messaging system is updated.

## Purpose

-   Test that log messages are correct and user-friendly
-   Do **NOT** test game logic or card implementation details
-   Focus purely on the text output shown to players

## Guidelines

### Use `toHaveAllChatMessagesBe`

All message tests should use the `toHaveAllChatMessagesBe` matcher, which checks the complete sequence of messages after the turn 2 house choice:

```javascript
expect(this).toHaveAllChatMessagesBe([
    'player1 plays Card Name',
    'player1 uses Card Name to do something',
    'player1 discards Other Card from hand'
]);
```

### Random Discards

When testing random discards, use template strings to reference cards by their discard pile position rather than hardcoding card names:

```javascript
// Random order - use template strings
`player2 randomly discards ${this.player2.discard[1].name} from hand`,
    `player2 randomly discards ${this.player2.discard[0].name} from hand`;
```

The discard pile is ordered with most recent discard at index 0. So if you want the first card discarded, look at the highest index; for the last card discarded, look at index 0.

### Always Check `isReadyToTakeAction`

After completing all prompts, verify the game state is ready before checking messages:

```javascript
this.player1.play(this.someCard);
this.player1.clickPrompt('Me');
this.player1.clickPrompt('Autoresolve');
expect(this.player1).isReadyToTakeAction(); // Ensures all prompts are resolved
expect(this).toHaveAllChatMessagesBe([...]);
```

This catches cases where prompts weren't fully resolved, which would result in incomplete message logs.

### Avoid Autoresolve

Don't use `Autoresolve` unless specifically testing autoresolve behavior. Manually select cards to ensure deterministic message order:

```javascript
// Good - deterministic order
this.player1.clickCard(this.dustPixie);
this.player1.clickCard(this.flaxia);

// Avoid - random order makes message assertions flaky
this.player1.clickPrompt('Autoresolve');
```

### Test Setup

Message tests use the standard test harness. Set up the game state in `beforeEach`:

```javascript
beforeEach(function () {
    this.setupTest({
        player1: {
            house: 'logos',
            hand: ['card-to-play', 'other-card']
        },
        player2: {
            hand: ['opponent-card']
        }
    });
});
```

## When to Add Tests

### Add to This Directory

When a card uses **default game action messages** in a new way, add a test here. Examples:

-   New location for random discard (e.g., archives instead of hand)
-   New target pattern (e.g., both players, self only)
-   New edge cases for existing message patterns

### Add to Card-Specific Tests

When a card has **custom message logic** that differs from the default, add message assertions to that card's test file using `toHaveAllChatMessagesBe`:

```javascript
// In test/server/cards/Set/CardName.spec.js
it('should log custom message for special ability', function () {
    this.player1.useAction(this.cardName);
    expect(this.player1).isReadyToTakeAction();
    expect(this).toHaveAllChatMessagesBe([
        'player1 uses Card Name',
        'player1 uses Card Name to do something unique'
    ]);
});
```

## Test Coverage Patterns

### Amount Variations

For each action that operates on a quantity, test:

-   **0 items** - Action resolves but nothing happens (e.g., discard from empty hand)
-   **1 item** - Singular message format (e.g., "1 card")
-   **Multiple items** - Plural message format (e.g., "2 cards")
-   **Exact amount** - Zone has exactly the amount requested (e.g., draw 3 with 3 in deck)
-   **Amount + 1** - Zone has one more than requested (e.g., draw 3 with 4 in deck)
-   **Less than requested** - Zone has fewer cards than requested (e.g., draw 3 with 2 in deck)

### Zone Edge Cases

For actions that affect specific zones, test with:

-   **Empty zone** - Empty hand, deck, discard, archives, or purge
-   **1 card in zone** - Minimum non-empty state
-   **2-3 cards in zone** - Small amounts for multi-card actions
-   **Partial availability** - Fewer cards available than action requests

### Target Variations

For each action that can target different players, test:

-   **Self only** - Player affects their own cards/resources
-   **Opponent only** - Player affects opponent's cards/resources
-   **Both players** - Action affects both (test order prompts if applicable)
-   **Unequal amounts** - Different amounts for each player (e.g., player1 discards 2, player2 discards 3)

### Action Combinations

Each game action should have tests for:

-   **Standalone** - The basic action in isolation
-   **With scrap** - Action triggered by discarding a card
-   **With restrictions** - Action with conditions (e.g., "if you have no amber")
-   **With extra effects** - Action combined with other effects (e.g., "and gain 1 amber")
-   **As triggers** - Action triggered by other game events (e.g., "after a creature is destroyed")

Focus on combinations where a **meaningful difference** in messaging could occur. It's not feasible to test every possible combination - prioritize cases where the message format or content would differ.

### Example Coverage Matrix

For random discard, the full coverage would be:

| Amount | Target   | Location | Test Case               |
| ------ | -------- | -------- | ----------------------- |
| 0      | Opponent | Hand     | Empty hand - no message |
| 1      | Opponent | Hand     | Mind Barb               |
| 2+     | Opponent | Hand     | Addlefish               |
| 1      | Self     | Hand     | Vapor Imp               |
| 1+     | Both     | Hand     | Trihard                 |
| 1      | Opponent | Archives | Tantadlin               |
| 1      | Self     | Archives | Barter and Games        |
