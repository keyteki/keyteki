# Card Abilities

This document describes how card abilities are defined in Keyteki. All card abilities are defined in the `setupCardAbilities(ability)` method of a card class.

## Table of Contents

-   [Basic Structure](#basic-structure)
-   [Ability Types](#ability-types)
    -   [play()](#play)
    -   [reap()](#reap)
    -   [fight()](#fight)
    -   [beforeFight()](#beforefight)
    -   [destroyed()](#destroyed)
    -   [action()](#action)
    -   [omni()](#omni)
    -   [persistentEffect()](#persistenteffect)
    -   [whileAttached()](#whileattached)
    -   [reaction()](#reaction)
    -   [interrupt()](#interrupt)
    -   [scrap()](#scrap)
    -   [fate()](#fate)
    -   [prophecyInterrupt()](#prophecyinterrupt)
    -   [prophecyReaction()](#prophecyreaction)
-   [Ability Properties](#ability-properties)
    -   [Conditions](#conditions)
    -   [Optional](#optional)
    -   [Targeting](#targeting)
    -   [Chaining Effects with "then"](#chaining-effects-with-then)

## Basic Structure

Every card follows this general pattern to set up its abilities:

```javascript
const Card = require('../../Card.js');

class CardName extends Card {
    // Card text goes here as a comment
    setupCardAbilities(ability) {
        this.abilityType({
            // ability properties
        });
    }
}

CardName.id = 'card-id';

module.exports = CardName;
```

## Ability Types

### play()

Triggered abilities that activate after the card is played. Bonus icons are resolved before play abilities.

```javascript
// Play: Gain 2A.
this.play({
    gameAction: ability.actions.gainAmber({ amount: 2 })
});
```

```javascript
// Play: Capture 3A.
this.play({
    gameAction: ability.actions.capture({ amount: 3 })
});
```

```javascript
// Play: Ready and fight with a friendly creature.
this.play({
    target: {
        cardType: 'creature',
        controller: 'self',
        gameAction: ability.actions.sequential([ability.actions.ready(), ability.actions.fight()])
    },
    effect: 'ready and fight with {0}'
});
```

### reap()

Triggered abilities that activate after the creature reaps (exhausts to gain 1 aember).

```javascript
// Reap: Draw a card.
this.reap({
    gameAction: ability.actions.draw()
});
```

```javascript
// Reap: Steal 1A.
this.reap({
    gameAction: ability.actions.steal()
});
```

### fight()

Triggered abilities that activate after the creature fights. The creature must survive the fight to trigger this ability.

```javascript
// Fight: Deal 2 damage to a creature.
this.fight({
    target: {
        cardType: 'creature',
        gameAction: ability.actions.dealDamage({ amount: 2 })
    }
});
```

### beforeFight()

Triggered abilities that activate immediately before a creature fights, before damage is dealt. Useful for abilities that need to happen before combat damage.

```javascript
// Before Fight: Deal 1 damage to each neighbor of the creature Mindworm fights.
this.beforeFight({
    target: {
        cardType: 'creature',
        mode: 'exactly',
        numCards: 2,
        optional: true,
        cardCondition: (card, context) => context.event.card.neighbors.includes(card),
        gameAction: ability.actions.dealDamage({ amount: 1 })
    }
});
```

### destroyed()

Triggered abilities that activate when the card is destroyed. These are implemented as interrupts that trigger before any cards leave play due to destruction.

```javascript
// Destroyed: Gain 2A.
this.destroyed({
    gameAction: ability.actions.gainAmber({ amount: 2 })
});
```

```javascript
// Destroyed: Return this card to your hand.
this.destroyed({
    gameAction: ability.actions.returnToHand()
});
```

### action()

Activated abilities that exhaust the card to use.

```javascript
// Action: Keys cost +3A during your opponent's next turn.
this.action({
    effect: "increase key cost by 3 during {1}'s next turn",
    effectArgs: (context) => context.player.opponent,
    gameAction: ability.actions.duringOpponentNextTurn({
        targetController: 'any',
        effect: ability.effects.modifyKeyCost(3)
    })
});
```

```javascript
// Action: Purge a creature in play.
this.action({
    target: {
        cardType: 'creature',
        gameAction: ability.actions.purge()
    },
    effect: 'purge {0}'
});
```

### omni()

"Omni:" abilities can be used regardless of which house is active. They are essentially action abilities with the `omni` property set to true.

```javascript
// Omni: Sacrifice this artifact. If you do, gain 2A.
this.omni({
    gameAction: ability.actions.sacrifice(),
    then: {
        gameAction: ability.actions.gainAmber({ amount: 2 })
    }
});
```

### persistentEffect()

Ongoing effects that apply while the card is in play. These automatically apply to matching cards and remove themselves when the source card leaves play or becomes blank.

```javascript
// Your opponent cannot play more than 2 cards each turn.
this.persistentEffect({
    condition: () => this.game.cardsPlayed.length > 1,
    targetController: 'opponent',
    effect: ability.effects.playerCannot('play')
});
```

```javascript
// During their draw cards step, your opponent refills their hand to 1 less card.
this.persistentEffect({
    targetController: 'opponent',
    effect: ability.effects.modifyHandSize(-1)
});
```

```javascript
// Each friendly creature gets +1 power.
this.persistentEffect({
    match: (card) => card.type === 'creature',
    targetController: 'self',
    effect: ability.effects.modifyPower(1)
});
```

### whileAttached()

A specialized form of `persistentEffect()` used for **Upgrade** cards. Applies effects to the creature the upgrade is attached to. The effect automatically targets the parent creature.

```javascript
// This creature's controller gains control of it.
// (Collar of Subordination - takes control of enemy creature when attached)
this.whileAttached({
    effect: ability.effects.takeControl(() => this.controller)
});
```

```javascript
// This creature gets +2 power and gains "Reap: Deal 2 damage to a creature."
this.whileAttached({
    effect: [
        ability.effects.modifyPower(2),
        ability.effects.gainAbility('reap', {
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        })
    ]
});
```

#### `context.source` inside a gained ability

When an ability is granted via `ability.effects.gainAbility(...)` (whether from `whileAttached`, `persistentEffect`, or anywhere else), `context.source` inside that gained ability's callbacks resolves to **the card that has the gained ability** (the receiver), not the card that granted it.

```javascript
// Bypass Burglar — neighbors gain "Action: Steal 1A. Deal 1 damage to this creature."
// Inside the dealDamage callback, context.source is the neighbor, not Bypass Burglar.
this.persistentEffect({
    condition: () => this.exhausted,
    match: (card, context) => context.source.neighbors.includes(card),
    effect: ability.effects.gainAbility('action', {
        gameAction: ability.actions.sequential([
            ability.actions.steal(),
            ability.actions.dealDamage((context) => ({
                target: context.source // the neighbor that took the action
            }))
        ])
    })
});
```

### reaction()

Generic triggered abilities with custom trigger conditions. Use when `play()`, `reap()`, `fight()`, or `destroyed()` don't fit.

```javascript
// Each time you play another creature, gain 1A.
this.reaction({
    when: {
        onCardPlayed: (event, context) =>
            event.card.type === 'creature' &&
            event.player === context.player &&
            event.card !== context.source
    },
    gameAction: ability.actions.gainAmber()
});
```

```javascript
// After an enemy creature is destroyed, gain 1A.
this.reaction({
    when: {
        onCardDestroyed: (event, context) =>
            event.card.type === 'creature' && event.card.controller === context.player.opponent
    },
    gameAction: ability.actions.gainAmber()
});
```

#### `autoResolve` option

Set `autoResolve: true` on a `reaction()` or `interrupt()` when the ability should not prompt the player to pick an order **among multiple instances of the same ability** firing simultaneously. The engine will auto-resolve consecutive choices that all come from the same ability, then return to normal prompting for any other queued triggers. This is appropriate for triggers whose individual resolutions are independent and whose order is irrelevant to the outcome (e.g. each instance hits a different mandatory target).

```javascript
this.reaction({
    when: { onTurnEnded: (event, context) => event.player === context.player.opponent },
    autoResolve: true,
    gameAction: ability.actions.discardTopOfDeck()
});
```

`autoResolve` does **not** override the player's `orderForcedAbilities` option for choices between _different_ abilities — it only collapses the same-ability prompt.

### interrupt()

Abilities that trigger before an event resolves, potentially modifying or preventing it.

```javascript
// Before a friendly creature would be destroyed, you may sacrifice this card instead.
this.interrupt({
    when: {
        onCardDestroyed: (event, context) =>
            event.card.type === 'creature' &&
            event.card.controller === context.player &&
            event.card !== context.source
    },
    gameAction: ability.actions.sacrifice()
});
```

### scrap()

"Scrap:" abilities trigger when the card is discarded from the active player's hand (not from play) during their turn.

```javascript
// Scrap: Deal 3 damage to a creature.
this.scrap({
    target: {
        cardType: 'creature',
        gameAction: ability.actions.dealDamage({ amount: 3 })
    }
});
```

```javascript
// Scrap: Gain 2A.
this.scrap({
    gameAction: ability.actions.gainAmber({ amount: 2 })
});
```

### fate()

"Fate:" abilities trigger when revealed from the deck during specific game events, typically when drawing or discarding.

```javascript
// Fate: If you have 8A or more, you may forge a key at current cost.
this.fate({
    condition: (context) => context.player.amber >= context.player.getCurrentKeyCost(),
    may: 'forge a key',
    gameAction: ability.actions.forgeKey((context) => ({
        modifier: context.player.getCurrentKeyCost() - context.player.defaultKeyCost
    }))
});
```

```javascript
// Fate: Archive a card from your hand.
this.fate({
    target: {
        location: 'hand',
        controller: 'self',
        gameAction: ability.actions.archive()
    }
});
```

### prophecyInterrupt()

Prophecy abilities that trigger **at** a specific point in time during your opponent's turn. Use `prophecyInterrupt()` when the card ability happens at a specific step or phase during your opponent's turn.

```javascript
// At the end of your opponent's turn, if they have exactly 6A, fulfill Bad Omen.
this.prophecyInterrupt({
    when: {
        onTurnEnd: (_, context) =>
            this.game.activePlayer === context.source.controller.opponent &&
            this.game.activePlayer.amber === 6
    },
    gameAction: ability.actions.fulfillProphecy((context) => ({
        card: context.source
    }))
});
```

```javascript
// At the end of your opponent's turn, if they have more A than you, fulfill The Early Bird.
this.prophecyInterrupt({
    when: {
        onTurnEnd: (event, context) =>
            context.game.activePlayer === context.source.controller.opponent &&
            context.game.activePlayer.amber > context.source.controller.amber
    },
    gameAction: ability.actions.fulfillProphecy((context) => ({
        card: context.source
    }))
});
```

### prophecyReaction()

Prophecy abilities that trigger **after** an event occurs during your opponent's turn. Use `prophecyReaction()` when the card reacts to something that your opponent does during their turn.

```javascript
// During your opponent's turn, after your opponent shuffles their deck, fulfill Expect the Unexpected.
this.prophecyReaction({
    when: {
        onDeckShuffled: (event, context) => event.player !== context.source.controller
    },
    gameAction: ability.actions.fulfillProphecy((context) => ({
        card: context.source
    }))
});
```

```javascript
// During your opponent's turn, after an enemy creature is used to fight, fulfill Go Forth and Conquer.
this.prophecyReaction({
    when: {
        onUseCard: (event, context) =>
            context.game.activePlayer === context.source.controller.opponent &&
            event.fight &&
            event.fightEvent.attacker.controller === context.source.controller.opponent
    },
    gameAction: ability.actions.fulfillProphecy((context) => ({
        card: context.source
    }))
});
```

## Ability Properties

Most ability types accept these common properties:

| Property      | Description                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| `condition`   | A function that must return true for the ability to be usable.                                             |
| `effect`      | Text shown in the game log. Use `{0}`, `{1}`, etc. for placeholders. See [Card Messages](card-messages.md) |
| `effectArgs`  | Arguments to fill in the effect string placeholders. See [Card Messages](card-messages.md)                 |
| `gameAction`  | The action(s) to perform. Can be a single action or an array. See [Game Actions](game-actions.md).         |
| `message`     | Custom message to display when the ability is used. See [Card Messages](card-messages.md)                  |
| `messageArgs` | Arguments for the custom message placeholders. See [Card Messages](card-messages.md)                       |
| `optional`    | If true, the player can choose not to use the ability.                                                     |
| `target`      | Defines what the player must select as a target.                                                           |
| `then`        | A follow-up ability that triggers after the main ability resolves.                                         |

### Conditions

Use `condition` to make abilities conditional:

```javascript
// Play: If your opponent has 7A or more, capture all of it.
this.play({
    condition: (context) => context.player.opponent && context.player.opponent.amber >= 7,
    gameAction: ability.actions.capture((context) => ({
        amount: context.player.opponent.amber
    }))
});
```

### Optional

Use `optional: true` when the card text says "you may" to let the player choose whether to use the ability.

**For "you may" abilities with a single card target, put `optional: true` inside the `target` block, not on the ability:**

```javascript
// Play: You may deal 2 damage to a creature.
this.play({
    target: {
        optional: true,
        cardType: 'creature',
        gameAction: ability.actions.dealDamage({ amount: 2 })
    }
});
```

This shows the target prompt directly with a "Done" button to decline. Putting `optional: true` at the ability level on a `play`/`fight`/`reap` with a single `target:` instead generates an extra "Any reactions?" opt-in step that requires the player to click the source card before they can pick a target — worse UX.

**Use ability-level `optional: true` when:**

-   The ability has no `target:` block (e.g., "you may exalt this creature", "you may forge a key").
-   The ability has a `then:` and the player should be able to atomically decline both the target and the `then` effect (e.g., Nirbor Flamewing).
-   The ability uses `targets:` (plural) with multiple targets, and declining should skip all of them together.
-   The ability uses `mode: 'house'` or `mode: 'select'` (a choice prompt rather than a card-target prompt).
-   The ability is a triggered `reaction` / `interrupt` where the global "Any reactions?" prompt is the desired UX (so the target prompt doesn't pop up every time the trigger fires).

```javascript
// Play: You may exalt Dino-Knight. If you do, deal 3D to a creature.
this.play({
    optional: true,
    gameAction: ability.actions.exalt(),
    then: {
        target: {
            cardType: 'creature',
            gameAction: ability.actions.dealDamage({ amount: 3 })
        }
    }
});
```

### Targeting

The `target` property defines what the player must select:

```javascript
// Target any creature
target: {
  cardType: 'creature',
    gameAction: ability.actions.destroy()
}

// Target a creature you control
target: {
    cardType: 'creature',
    controller: 'self',
    gameAction: ability.actions.ready()
}

// Target a creature the opponent controls
target: {
    cardType: 'creature',
    controller: 'opponent',
    gameAction: ability.actions.stun()
}

// Target with a custom condition
target: {
    cardType: 'creature',
    cardCondition: (card) => card.power <= 3,
    gameAction: ability.actions.destroy()
}
```

### Chaining Effects with "then"

Use `then` for sequential effects or effects that depend on the success of previous effects:

```javascript
// Play: Steal 1A. If your opponent still has more A than you, steal 1A.
this.play({
    condition: (context) =>
        context.player.opponent && context.player.amber < context.player.opponent.amber,
    gameAction: ability.actions.steal(),
    then: {
        alwaysTriggers: true,
        condition: (context) =>
            context.player.opponent && context.player.amber < context.player.opponent.amber,
        gameAction: ability.actions.steal(),
        message: '{0} uses {1} to steal an additional amber'
    }
});
```

The `then` block supports:

-   `alwaysTriggers: true` - The "then" effect triggers even if the main effect didn't fully resolve
-   `condition` - Additional condition for the "then" effect
-   `may` - Prompt text if the player can choose whether to do the "then" effect

#### "If you do" Clauses

When card text says "If you do, ...", the follow-up effect must trigger **only if the preceding effect actually happened**. By default, a `then` block is already gated by whether the prior `gameAction`'s events resolved uncancelled, so simple cases work automatically:

```javascript
// Sacrifice this artifact. If you do, gain 2A.
this.omni({
    gameAction: ability.actions.sacrifice(),
    then: {
        gameAction: ability.actions.gainAmber({ amount: 2 })
    }
});
```

For chained "If you do" clauses (e.g. "Capture 2A. You may discard a card. If you do, ..."), each clause's condition must verify what really happened, not the final card state. Common pitfalls:

-   **Don't infer success from card state.** `source.hasToken('amber')` is true even if amber was already on the card before the ability resolved — it does not prove a capture succeeded this turn.
-   **Inspect `preThenEvents` for the actual events.** Each event has a `name` and result fields (e.g. `amount` for `onCapture`). Use these to confirm the effect occurred at the required magnitude.
-   **Check optional target selection with `!!preThenContext.target`.** When `target.optional` is true, `target` is empty/falsy if the player declined.

```javascript
// After Reap: Capture 2A. You may discard a card.
// If you do, move 1A from this creature to your pool.
this.reap({
    gameAction: ability.actions.capture({ amount: 2 }),
    then: {
        alwaysTriggers: true,
        target: {
            optional: true,
            location: 'hand',
            controller: 'self',
            gameAction: ability.actions.discard()
        },
        then: (preThenContext) => ({
            condition: () =>
                // Both clauses of "If you do" must be satisfied:
                !!preThenContext.target && // a card was actually discarded
                preThenContext.preThenEvents.some(
                    (event) => event.name === 'onCapture' && event.amount === 2
                ), // and the capture was the full 2 amber
            gameAction: ability.actions.returnAmber({
                target: preThenContext.source,
                amount: 1,
                recipient: preThenContext.player
            })
        })
    }
});
```

Note that `alwaysTriggers: true` is needed on the outer `then` so the optional-discard prompt still appears even when the capture event was cancelled or partial — but the inner `then`'s `condition` then ensures the final effect is gated correctly.

#### Pitfall: `alwaysTriggers` does not bypass legal-target checks

`alwaysTriggers: true` controls whether a `then` block fires when the **preceding** `gameAction` was cancelled or didn't fully resolve. It does **not** override the engine's requirement that the `then` block itself must have at least one legal target for its `gameAction`. If the `then`'s `gameAction` has no legal target, the entire `then` block — including any nested `then` chain inside it — is silently skipped.

This is usually what you want (e.g. drawing 0 cards is a no-op anyway). It becomes a bug when the `then` block has a **nested** `then` chain that should still run regardless of whether the outer `gameAction` had a target — for example, a card that reveals from hand and then draws, where the draw should happen even with an empty hand.

The fix is to use a function-form `then` that branches on the empty case and returns a no-`gameAction` object:

```javascript
// BUG: if the player's hand is empty, the reveal has no legal target,
// the entire then is skipped, and the draw never happens.
this.play({
    gameAction: ability.actions.destroy(/* ... */),
    then: {
        alwaysTriggers: true,
        gameAction: ability.actions.reveal((context) => ({ target: context.player.hand })),
        then: {
            alwaysTriggers: true,
            gameAction: ability.actions.draw({ amount: 1 })
        }
    }
});

// FIX: wrap the reveal in a function-form then. When the hand is empty,
// return an object with no gameAction (so meetsRequirements passes) and
// the nested then-chain still runs.
this.play({
    gameAction: ability.actions.destroy(/* ... */),
    then: {
        alwaysTriggers: true,
        then: (preThenContext) =>
            preThenContext.player.hand.length === 0
                ? {
                      alwaysTriggers: true,
                      message: '{0} reveals nothing',
                      messageArgs: () => [preThenContext.player],
                      then: {
                          alwaysTriggers: true,
                          gameAction: ability.actions.draw({ amount: 1 })
                      }
                  }
                : {
                      alwaysTriggers: true,
                      gameAction: ability.actions.reveal({ target: preThenContext.player.hand }),
                      then: {
                          alwaysTriggers: true,
                          gameAction: ability.actions.draw({ amount: 1 })
                      }
                  }
    }
});
```

The engine includes a test-mode assertion that throws when this pattern is detected: a function-form `then` whose returned `gameAction` has no legal target while its outer `alwaysTriggers: true` block has a further nested `then`-chain. If you see this error, refactor the function-form `then` to return a no-`gameAction` object on the empty case (as shown above) so the inner chain still runs.
