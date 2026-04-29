# Card Messages

This document describes how to add descriptive log messages to card abilities. Good messages help players understand what happened during a game.

## Table of Contents

-   [Basic Usage](#basic-usage)
-   [Properties](#properties)
    -   [effect / effectArgs](#effect--effectargs)
    -   [message / messageArgs](#message--messageargs)
-   [Default Messages](#default-messages)
    -   [When to Override Default Messages](#when-to-override-default-messages)
-   [Common Patterns](#common-patterns)
    -   [Adding Dynamic Values](#adding-dynamic-values)
    -   [Conditional Messages](#conditional-messages)
    -   [Then Effect Messages](#then-effect-messages)
    -   [Messages for Optional Actions](#messages-for-optional-actions)
    -   [Using preThenContext](#using-prethencontext)
    -   [preThenEvents for Multiple Targets](#prethenevents-for-multiple-targets)
    -   [Referencing `this` in effectArgs](#referencing-this-in-effectargs)
    -   [Appending Text Conditionally](#appending-text-conditionally)
    -   [Context Event Data](#context-event-data)
    -   [Revealing Cards with Conditional Text](#revealing-cards-with-conditional-text)
    -   [promptForSelect with messageArgs](#promptforselect-with-messageargs)
    -   [Pluralization in Messages](#pluralization-in-messages)
    -   [Raw String Values in effectArgs](#raw-string-values-in-effectargs)
    -   [Named Card References](#named-card-references)
    -   [Static messageArgs Values](#static-messageargs-values)
    -   [Computed Effects with Multiple Branches](#computed-effects-with-multiple-branches)
    -   [Multi-part Message Building](#multi-part-message-building)
-   [Best Practices](#best-practices)
-   [Quick Reference](#quick-reference)
-   [Using `target`](#using-target)
-   [Locales](#locales)

## Basic Usage

Card abilities support two messaging approaches:

-   **`effect` / `effectArgs`** - For primary abilities. Automatically prefixed with "{player} uses {card} to..."
-   **`message` / `messageArgs`** - For custom messages or `then` effec-. Gives you full control over the message format.
-   Only one of effect/message can be used per ability or effect-

## Properties

### effect / effectArgs

The `effect` property is used for the main ability message. The effect message automatically prepends `"{player} uses {card} to "` to the provided effect template.

**Default placeholders:**

-   `{0}` - The target (or source if no target)

```javascript
// Simple effect with no arguments
// Output: "{player} uses Ammonia Clouds to deal 1 damage to each creature"
this.play({
  effect: 'deal 1 damage to each creature',
  gameAction: ability.actions.dealDamage((context) =} ({
    amount: 1,
    target: context.game.creaturesInPlay
  }))
});
```

```javascript
// Using {0} for target
// Output: "{player} uses Anger to ready and fight with {creature}"
this.play({
    target: {
        cardType: 'creature',
        controller: 'self',
        gameAction: ability.actions.sequential([ability.actions.ready(), ability.actions.fight()])
    },
    effect: 'ready and fight with {0}'
});
```

**Using `effectArgs` for additional placeholders:**

The `effectArgs` property provides values for placeholders `{1}`, `{2}`, `{3}`, etc. in your effect template string. It can be either:

-   An array of values: `effectArgs: [value1, value2]`
-   A function returning an array: `effectArgs: (context) => [value1, value2]`

The values map to placeholders as follows:

-   `{0}` - Still the default target (not from effectArgs)
-   `{1}` - First value in effectArgs array
-   `{2}` - Second value in effectArgs array
-   `{3}`, `{4}`, etc. - Continue in order

```javascript
// Output: "{player1} uses Effervescent Principle to gain 1 chain and make {player1} lose 3 amber and {player2} lose 2 amber"
this.play({
  effect: 'gain 1 chain and make {1} lose {2} amber and {3} lose {4} amber',
  //                             ^^^      ^^^           ^^^      ^^^
  //                   effectArgs[0]      [1]           [2]      [3]
  effectArgs: (context) =} [
    context.player,                                                    // {1} - player1
    Math.floor(context.player.amber / 2),                              // {2} - 3
    context.player.opponent,                                           // {3} - player2
    Math.floor((context.player.opponent ? context.player.opponent.amber : 0) / 2)  // {4} - 2
  ],
  gameAction: [
    ability.actions.loseAmber((context) =} ({
      amount: Math.floor((context.player.opponent ? context.player.opponent.amber : 0) / 2)
    })),
    ability.actions.loseAmber((context) =} ({
      target: context.player,
      amount: Math.floor(context.player.amber / 2)
    })),
    ability.actions.gainChains()
  ]
});
```

**Additional effect properties:**

-   `effectAlert` (bool) - Makes the message appear as an Alert (highlighted). Used for cards like Fogbank, Lifeward, Stealth Mode.
-   `effectStyle` (`"append"`, `"all"`, or `null`) - Controls how multiple actions' effects are combined in the message.

### message / messageArgs

The `message` property gives full control over the message format and does not prepend any text to the message string. You must include the player and card references yourself. Providing a `message` overrides the default `effect` output.

**Default placeholders:**

-   `{0}` - context.player
-   `{1}` - context.source.type (for abilities) or context.source (for `then` effects)
-   `{2}` - context.target

**Using `messageArgs` for additional placeholders:**

The `messageArgs` property works similarly to `effectArgs`, but since `message` gives you full control, you can also override the default placeholders `{0}`, `{1}`, `{2}`. It can be either:

-   An array of values: `messageArgs: [value1, value2]`
-   A function returning an array: `messageArgs: (context) => [value1, value2]`

The values map to placeholders as follows:

-   `{0}`, `{1}`, `{2}` - Default values (player, source, target)
-   `{3}` - First value in messageArgs array
-   `{4}` - Second value in messageArgs array
-   `{5}`, `{6}`, etc. - Continue in order

```javascript
// Overriding defaults: messageArgs provides {0}, {1}, {2}
message: '{0} uses {1} to steal {2} amber',
messageArgs: (context) => [
  context.player,    // {0}
  context.source,    // {1}
  actualStealAmount  // {2}
]
```

```javascript
// Custom message with steal amount
// Output: "{player} uses Mnemoleech to steal 2 amber"
this.reap({
  gameAction: ability.actions.conditional({
    condition: (context) =} !!context.player.opponent && context.player.opponent.isHaunted(),
    trueGameAction: ability.actions.steal({ amount: 2 }),
    falseGameAction: ability.actions.steal({ amount: 1 })
  }),
  message: '{0} uses {1} to steal {2} amber',
  //        ^^^      ^^^          ^^^
  //   messageArgs[0]  [1]          [2]
  messageArgs: (context) =} [
    context.player,      // {0} - player
    context.source,      // {1} - Mnemoleech
    !!context.player.opponent && context.player.opponent.isHaunted()
      ? Math.min(2, context.player.opponent.amber ?? 0)
      : Math.min(1, context.player.opponent.amber ?? 0)  // {2} - 2
  ]
});
```

**Additional message properties:**

-   `preferActionPromptMessage` (bool) - Suppresses the default game action message. Use this when you want to provide a custom message via a `then:` block instead of the automatic message generated by the game action. This is useful when:
    -   The default message doesn't accurately describe what happened (e.g., when not all targets were affected)
    -   You need to show which specific cards were affected after the action completes
    -   The action involves player choice and you want the message to reflect the actual outcome

```javascript
// Card: "After a player forges a key, each creature they control captures 1A from its own side."
// Without preferActionPromptMessage, the default capture message would show before
// the player chooses which creatures capture (when there's not enough amber).
// With it, we can show a message listing only the creatures that actually captured.
this.reaction({
    when: {
        onForgeKey: () => true
    },
    preferActionPromptMessage: true,
    gameAction: ability.actions.capture((context) => ({
        target: context.event.player.creaturesInPlay,
        player: context.event.player
    })),
    then: {
        message: '{0} uses {1} to make {3} capture 1 amber from their side',
        messageArgs: (context) => [context.preThenEvents.map((e) => e.card)]
    }
});
```

## Default Messages

Many game actions in Keyteki generate automatic log messages. For example:

-   `ability.actions.capture({ amount: 2 })` logs "{player} uses {card} to capture 2 amber"
-   `ability.actions.steal({ amount: 2 })` logs "{player} uses {card} to steal 2 amber"

However, if the player doesn't have enough amber, the default message can be misleading. When the actual outcome differs from what the card text says, you should provide custom messages showing what actually happened.

### When to Override Default Messages

**Capped by available resources:** If a card says "Capture 3 amber" but the opponent only has 1 amber, the default message might say "capture 3 amber" when only 1 was actually captured.

```javascript
// Bad: Default message says "capture 3 amber" even if opponent only has 1
this.play({
  gameAction: ability.actions.capture({ amount: 3 })
});

// Good: Show actual amount captured
this.play({
  effect: 'capture {1} amber',
  effectArgs: (context) =} [Math.min(3, context.player.opponent?.amber ?? 0)],
  gameAction: ability.actions.capture({ amount: 3 })
});
```

**Conditional amounts:** When the amount depends on game state:

```javascript
// Card: "Steal 2 amber if opponent is haunted, otherwise steal 1"
// Bad: No message, or generic message
this.reap({
  gameAction: ability.actions.conditional({
    condition: (context) =} context.player.opponent?.isHaunted(),
    trueGameAction: ability.actions.steal({ amount: 2 }),
    falseGameAction: ability.actions.steal({ amount: 1 })
  })
});

// Good: Show actual steal amount (also capped by opponent's amber)
this.reap({
  gameAction: ability.actions.conditional({
    condition: (context) =} context.player.opponent?.isHaunted(),
    trueGameAction: ability.actions.steal({ amount: 2 }),
    falseGameAction: ability.actions.steal({ amount: 1 })
  }),
  message: '{0} uses {1} to steal {2} amber',
  messageArgs: (context) =} [
    context.player,
    context.source,
    context.player.opponent?.isHaunted()
      ? Math.min(2, context.player.opponent?.amber ?? 0)
      : Math.min(1, context.player.opponent?.amber ?? 0)
  ]
});
```

**Multiple targets with varying results:** When affecting multiple cards where some might be warded, destroyed, etc.

```javascript
// Card: "Deal 1D to each creature. Gain 1A for each creature destroyed this way."
// Bad: Vague message that doesn't tell the player what happened:
this.play({
    gameAction: ability.actions.dealDamage((context) => ({
        target: context.game.creaturesInPlay
    })),
    then: {
        alwaysTriggers: true,
        gameAction: ability.actions.gainAmber((context) => ({
            amount: context.preThenEvents.filter(
                (event) =>
                    event.destroyEvent &&
                    event.destroyEvent.destroyedByDamageDealt &&
                    event.destroyEvent.resolved
            ).length
        })),
        message: '{0} gains amber for each creature destroyed this way'
    }
});

// Good:  - Shows which creatures were destroyed and the total amber gained:
this.play({
    gameAction: ability.actions.dealDamage((context) => ({
        target: context.game.creaturesInPlay
    })),
    then: {
        alwaysTriggers: true,
        gameAction: ability.actions.gainAmber((context) => ({
            amount: context.preThenEvents.filter(
                (event) =>
                    event.destroyEvent &&
                    event.destroyEvent.destroyedByDamageDealt &&
                    event.destroyEvent.resolved
            ).length
        })),
        message:
            '{0} uses {1} to gain 1 amber for each creature destroyed this way ({3}), gaining a total of {4} amber',
        messageArgs: (context) => [
            context.preThenEvents
                .filter(
                    (event) =>
                        event.destroyEvent &&
                        event.destroyEvent.destroyedByDamageDealt &&
                        event.destroyEvent.resolved
                )
                .map((event) => event.card),
            context.preThenEvents.filter(
                (event) =>
                    event.destroyEvent &&
                    event.destroyEvent.destroyedByDamageDealt &&
                    event.destroyEvent.resolved
            ).length
        ]
    }
});
```

**"For each" effects:** When the total depends on a count:

```javascript
// Card: "Gain 1 amber for each friendly creature"
// Show the total gained, not just "gain amber for each creature"
this.play({
  effect: 'gain {1} amber for each friendly creature',
  effectArgs: (context) =} [context.player.creaturesInPlay.length],
  gameAction: ability.actions.gainAmber((context) =} ({
    amount: context.player.creaturesInPlay.length
  }))
});
```

## Common Patterns

### Adding Dynamic Values

Show the actual amounts being affected rather than generic descriptions:

```javascript
// Bad: "{player} uses Commune to lose all their amber and gain 4 amber"
// Good: "{player} uses Commune to lose all 3 amber and gain 4 amber"
this.play({
  message: '{0} uses {1} to lose all {2} amber and gain 4 amber',
  messageArgs: (context) =} [context.player, context.source, context.player.amber],
  gameAction: ability.actions.sequential([
    ability.actions.loseAmber((context) =} ({
      amount: context.player.amber,
      target: context.player
    })),
    ability.actions.gainAmber({ amount: 4 })
  ])
});
```

```javascript
// Show amber moved from a creature
// Output: "{player} uses Azuretooth to move all 2 amber from {creature} to their pool..."
this.reap({
  target: {
    cardType: 'creature',
    gameAction: ability.actions.returnAmber((context) =} ({
      recipient: context.player
    }))
  },
  effect: 'move all {2} amber from {0} to their pool and give control of {0} to {1}',
  effectArgs: (context) =} [context.player.opponent, context.target.tokens.amber || 0]
  // ...
});
```

### Conditional Messages

Handle messages that need to show different content based on game state:

```javascript
// Output: "{player1} uses Submersive Principle to make {player1} lose 1 amber and {player2} lose 4 amber"
this.play({
  effect: 'make {1} lose {2} amber and {3} lose {4} amber',
  effectArgs: (context) =} [
    context.player,
    context.player.isTideHigh()
      ? Math.floor(context.player.amber / 2)
      : Math.min(1, context.player.amber),
    context.player.opponent,
    context.player.isTideHigh()
      ? Math.floor((context.player.opponent ? context.player.opponent.amber : 0) / 2)
      : Math.min(1, context.player.opponent ? context.player.opponent.amber : 0)
  ],
  gameAction: [
    // ... actions
  ]
});
```

### Then Effect Messages

For `then` effects, use `message` and `messageArgs` since `effect` is not available:

```javascript
// Output:
// "{player} uses Membership Drive to make a token creature"
// "{player} uses Membership Drive to gain 1 amber for each friendly token creature, gaining a total of 3 amber"
this.play({
  gameAction: ability.actions.sequential([
    ability.actions.makeTokenCreature(),
    ability.actions.gainAmber((context) =} ({
      amount: context.player.creaturesInPlay.filter((c) =} c.isToken()).length
    }))
  ]),
  effect: 'make a token creature',
  then: {
    message:
      '{0} uses {1} to gain 1 amber for each friendly token creature, gaining a total of {3} amber',
    messageArgs: (context) =} [context.player.creaturesInPlay.filter((c) =} c.isToken()).length]
  }
});
```

```javascript
// Reporting what was destroyed
// Output: "{player} uses Kerwollop to gain 1 amber for each creature destroyed this way ({destroyed creatures}), gaining a total of 2 amber"
this.play({
  gameAction: ability.actions.dealDamage((context) =} ({
    target: context.game.creaturesInPlay
  })),
  then: {
    alwaysTriggers: true,
    gameAction: ability.actions.gainAmber((context) =} ({
      amount: context.preThenEvents.filter(
        (event) =}
          event.destroyEvent &&
          event.destroyEvent.destroyedByDamageDealt &&
          event.destroyEvent.resolved
      ).length
    })),
    message:
      '{0} uses {1} to gain 1 amber for each creature destroyed this way ({3}), gaining a total of {4} amber',
    messageArgs: (context) =} [
      context.preThenEvents
        .filter(
          (event) =}
            event.destroyEvent &&
            event.destroyEvent.destroyedByDamageDealt &&
            event.destroyEvent.resolved
        )
        .map((event) =} event.card),
      context.preThenEvents.filter(
        (event) =}
          event.destroyEvent &&
          event.destroyEvent.destroyedByDamageDealt &&
          event.destroyEvent.resolved
      ).length
    ]
  }
});
```

### Messages for Optional Actions

When an action might be declined, use a `then` to describe what happened:

```javascript
// Output when kept: "{player} uses Scout Pete to look at the top card of their deck"
//                   "{player} uses Scout Pete to leave it on top of their deck"
// Output when discarded: "{player} uses Scout Pete to look at the top card of their deck"
//                        "{player} uses Scout Pete to discard {card}"
this.play({
  condition: (context) =} context.player.deck.length } 0,
  gameAction: ability.actions.discard((context) =} ({
    promptWithHandlerMenu: {
      optional: true,
      activePromptTitle: 'Select card to discard',
      cards: [context.player.deck[0]],
      choices: ['Leave on top of deck'],
      handlers: [() =} []]
    }
  })),
  effect: 'look at the top card of their deck',
  then: {
    alwaysTriggers: true,
    condition: (context) =} !context.preThenEvent || context.preThenEvent.cancelled,
    message: '{0} uses {1} to leave it on top of their deck'
  }
});
```

```javascript
// Dynamic message based on whether action was taken
// Output: "{player} uses Future Booster to look at the top card of their deck"
//         "{player} uses Future Booster to move it to the bottom of their deck" (or "leave it on top...")
this.persistentEffect({
  targetController: 'self',
  effect: ability.effects.gainAbility('action', {
    gameAction: ability.actions.moveToBottom((context) =} ({
      promptWithHandlerMenu: {
        optional: true
        // ...
      }
    })),
    effect: 'look at the top card of their deck',
    then: {
      alwaysTriggers: true,
      message: '{0} uses {1} to {3}',
      messageArgs: (context) =} [
        context.preThenEvent && !context.preThenEvent.cancelled
          ? 'move it to the bottom of their deck'
          : 'leave it on top of their deck'
      ]
    }
  })
});
```

### Using preThenContext

When chaining `then` effects, use `preThenContext` to access the previous target:

```javascript
// Output: "{player} uses Æmbrosia Outpost to move 1 amber from {creature} to their pool"
this.action({
  target: {
    cardType: 'creature',
    controller: 'self',
    gameAction: ability.actions.returnToDeck({ bottom: true })
  },
  then: {
    target: {
      cardType: 'creature',
      controller: 'self',
      cardCondition: (card) =} card.hasToken('amber'),
      gameAction: ability.actions.removeAmber()
    },
    then: (preThenContext) =} ({
      gameAction: ability.actions.gainAmber(),
      message: '{0} uses {1} to move 1 amber from {3} to their pool',
      messageArgs: [preThenContext.target]
    })
  }
});
```

### preThenEvents for Multiple Targets

When a `then` effect follows an action that affected multiple targets, use `preThenEvents` to get all the event results:

```javascript
// Card: "Heal 1 damage from each creature. Gain 1 amber for each creature healed this way."
// Output: "{player} uses Cleansing Wave to heal 1 damage from all creatures"
//         "Cleansing Wave heals {Creature1}, {Creature2}, gaining {player} 2 amber"
this.play({
    effect: 'heal 1 damage from all creatures',
    gameAction: ability.actions.heal((context) => ({
        amount: 1,
        target: context.game.creaturesInPlay.filter((card) => card.hasToken('damage'))
    })),
    then: {
        message: '{1} heals {3}, gaining {0} {4} amber',
        messageArgs: (context) => {
            let successfulEvents = context.preThenEvents.filter(
                (event) => !event.cancelled && event.amount > 0
            );
            return [successfulEvents.map((event) => event.card), successfulEvents.length];
        },
        gameAction: ability.actions.gainAmber((context) => ({
            amount: context.preThenEvents.filter((event) => !event.cancelled && event.amount > 0)
                .length
        }))
    }
});
```

### Referencing `this` in effectArgs

When you need to reference the card itself (not `context.source`), use arrow functions with `this`:

```javascript
// Card: "Destroyed: Instead of destroying Self-Bolstering Automata, fully heal it..."
// effectArgs uses `this` because we need the card instance
this.destroyed({
    condition: (context) => context.player.creaturesInPlay.length > 1,
    effect: 'heal all damage from {0}, exhaust it and move it to a flank',
    effectArgs: () => this, // Arrow function preserves `this` binding
    gameAction: [
        ability.actions.heal({ fully: true }),
        ability.actions.exhaust(),
        ability.actions.moveToFlank()
        // ...
    ]
});
```

### Appending Text Conditionally

Build dynamic effect strings by conditionally appending text:

```javascript
// Card: "Make a token creature. If you have fewer than 4 cards in hand, archive Initiation."
// Output (hand >= 4): "{player} uses Initiation to make a token creature"
// Output (hand < 4):  "{player} uses Initiation to make a token creature and archive itself"
this.play({
    effect: 'make a token creature{1}', // {1} may be empty or additional text
    effectArgs: (context) => (context.player.hand.length < 4 ? ' and archive itself' : ''),
    gameAction: ability.actions.sequential([
        ability.actions.makeTokenCreature(),
        ability.actions.conditional({
            condition: (context) => context.player.hand.length < 4,
            trueGameAction: ability.actions.archive()
        })
    ])
});
```

### Context Event Data

Access event data through `context.event` for reaction abilities:

```javascript
// Card: "After an enemy creature is destroyed while fighting, put a glory counter on The Colosseum."
// Output: "{player} uses The Colosseum to place a glory counter on itself due to {destroyed creature} being destroyed"
this.reaction({
    when: {
        onCardDestroyed: (event, context) =>
            event.destroyedFighting &&
            event.clone.controller !== context.player &&
            event.clone.type === 'creature'
    },
    effect: 'place a glory counter on itself due to {1} being destroyed',
    effectArgs: (context) => [context.event.card], // The destroyed card from the event
    gameAction: ability.actions.addGloryCounter()
});
```

### Revealing Cards with Conditional Text

When revealing cards, include conditional explanations:

```javascript
// Card: "Reveal the top card of your deck. If it is a Logos card, play it. Otherwise, archive it."
this.reap({
    condition: (context) => context.player.deck.length > 0,
    effect: 'reveal {1}{2}', // {1} = card, {2} = explanation
    effectArgs: (context) => {
        let card = context.player.deck[0];
        if (!card) return [];
        let args = [card];
        if (card.hasHouse('logos')) {
            return args.concat(', which is a Logos card, and play it');
        }
        return args.concat(', which is not a Logos card, so it gets archived');
    },
    gameAction: [
        // ...
    ]
});
```

### promptForSelect with messageArgs

When using `promptForSelect` inside a game action, define the message and args within:

```javascript
// Card: "Archive a card. If you control Hyde, archive 2 cards instead."
this.reap({
    preferActionPromptMessage: true,
    gameAction: ability.actions.archive((context) => ({
        promptForSelect: {
            location: 'hand',
            controller: 'self',
            mode: 'exactly',
            message: '{0} uses {1} to archive {2} card', // Full message format
            messageArgs: (cards) => [context.player, context.source, cards.length],
            numCards: context.player.cardsInPlay.some((card) => card.name === 'Hyde') ? 2 : 1
        }
    }))
});
```

### Pluralization in Messages

Handle singular vs plural forms dynamically:

```javascript
// Card: "Exalt a creature. Make a token creature for each amber on that creature."
// Output (1 amber): "{player} uses Inspiring Oration to make a token creature"
// Output (3 amber): "{player} uses Inspiring Oration to make 3 token creatures"
this.play({
    target: {
        cardType: 'creature',
        controller: 'self',
        gameAction: ability.actions.exalt()
    },
    then: (preThenContext) => ({
        alwaysTriggers: true,
        message: '{0} uses {1} to make {3}{4}',
        messageArgs: () =>
            preThenContext.target.amber === 1
                ? ['a token creature', ''] // Singular
                : [preThenContext.target.amber, ' token creatures'], // Plural
        gameAction: ability.actions.makeTokenCreature(() => ({
            amount: preThenContext.target.amber
        }))
    })
});
```

### Raw String Values in effectArgs

Use plain strings for custom text like possessives or descriptors:

```javascript
// Card: "Move 1 amber from your pool or opponent's pool to Monument to Shrix"
// Output: "{player} uses Monument to Shrix to move one amber from their pool..."
// Output: "{player} uses Monument to Shrix to move one amber from their opponent's pool..."
this.action({
    target: {
        mode: 'select',
        activePromptTitle: "Which player's pool",
        choices: { Mine: () => true, "Opponent's": (context) => !!context.player.opponent }
    },
    effect: 'move one amber from {1} pool to Monument to Shrix',
    effectArgs: (context) => [context.select === 'Mine' ? 'their' : "their opponent's"],
    gameAction: ability.actions.loseAmber((context) => ({
        target: context.select === 'Mine' ? context.player : context.player.opponent
    }))
});
```

### Named Card References

When cards reference other named cards, use `context.cardName` for "name a card" selections:

```javascript
// Card: "Name a card. Until Etan's Jar leaves play, cards with that name cannot be played."
this.play({
    target: {
        mode: 'card-name'
    },
    effect: 'prevent cards named {1} from being played',
    effectArgs: (context) => [context.cardName], // The named card from selection
    gameAction: ability.actions.lastingEffect((context) => ({
        // ...
    }))
});
```

### Static messageArgs Values

When all values are known ahead of time (not derived from context), use a plain array:

```javascript
// Card: "Steal 1 amber. Then, steal 1 amber for each copy of Routine Job in your discard pile."
this.play({
    gameAction: ability.actions.steal(),
    then: (context) => ({
        message: '{0} steals additional {3} amber with {1}',
        messageArgs: [context.player.discard.filter((card) => card.name === 'Routine Job').length],
        gameAction: ability.actions.steal({
            amount: context.player.discard.filter((card) => card.name === 'Routine Job').length
        })
    })
});
```

### Computed Effects with Multiple Branches

For cards with complex state-dependent messaging:

```javascript
// Card: "Omni: If there are 6+ glory counters, remove 6 and forge a key at current cost."
// The effect message itself is computed based on game state
this.omni({
    effect: '{1}', // The entire effect text comes from effectArgs
    effectArgs: (context) => [
        this.tokens.glory >= 6 && context.player.amber >= context.player.getCurrentKeyCost()
            ? 'discard 6 glory counters and forge a key at current cost'
            : this.tokens.glory >= 6 && context.player.amber < context.player.getCurrentKeyCost()
            ? 'discard 6 glory counters'
            : 'do nothing'
    ],
    gameAction: ability.actions.clearGloryCounters(() => ({
        amount: this.tokens.glory >= 6 ? 6 : 0
    })),
    then: {
        gameAction: ability.actions.forgeKey()
    }
});
```

### Multi-part Message Building

For complex messages that need to build several parts:

```javascript
// Card: "Discard from deck until you discard a Logos card or run out. If not Logos, trigger again."
// The messageArgs returns multiple pieces that get assembled
this.then((preThenContext) => ({
    message: '{0} discards the top card of their deck due to {1}: {3}{4}{5}{6}',
    messageArgs: (context) => {
        let topCard = context.player.deck[0];
        if (topCard) {
            if (topCard.hasHouse('logos') || context.source.location !== 'play area') {
                return [topCard]; // Just the card name
            }
            return [topCard, '. ', context.source, "'s ability resolves again"]; // Card + explanation
        }
        return [];
    },
    gameAction: [
        // ...
    ]
}));
```

## Best Practices

-   **Show actual values, not descriptions** - Instead of "lose half their amber", show "lose 3 amber".
-   **Guard against undefined opponents** - Use `context.player.opponent ? ... : 0` for solo play compatibility.
-   **List affected cards** - When destroying/affecting multiple cards, list them: "({3}), gaining a total of {4} amber".
-   **Use `then` for multi-step messaging** - Split complex effects into `effect` for the first action and `then.message` for subsequent actions.
-   **Match the card text style** - Messages should read naturally like the card text.
-   **Handle pluralization** - Use conditional messageArgs for "1 creature" vs "3 creatures".
-   **Prefer `effect` for primary abilities** - The auto-prefix "{player} uses {card} to..." is cleaner.
-   **Use `message` in `then` blocks** - The `effect` property isn't available in `then` effects.

## Quick Reference

| Context Property        | Description                          | Example Usage                                  |
| ----------------------- | ------------------------------------ | ---------------------------------------------- |
| `context.player`        | Active player                        | `messageArgs: [context.player]`                |
| `context.source`        | The card with the ability            | `messageArgs: [context.source]`                |
| `context.target`        | Selected target(s)                   | `effect: 'destroy {0}'`                        |
| `context.targets`       | Multiple named targets               | `effectArgs: [Object.values(context.targets)]` |
| `context.event`         | Triggering event (reactions)         | `effectArgs: [context.event.card]`             |
| `context.event.card`    | Card from the event                  | For "when card destroyed" reactions            |
| `context.event.clone`   | Clone of destroyed card              | Access neighbors after destruction             |
| `context.house`         | Selected house                       | `effectArgs: [context.house]`                  |
| `context.cardName`      | Named card (card-name mode)          | `effectArgs: [context.cardName]`               |
| `context.select`        | Choice selection result              | `effectArgs: [context.select]`                 |
| `context.preThenEvent`  | Single event from previous action    | `messageArgs: [context.preThenEvent.amount]`   |
| `context.preThenEvents` | Array of events from previous action | For multi-target actions                       |
| `preThenContext.target` | Target from outer then               | Nested then chains                             |
| `this`                  | The card instance                    | `effectArgs: () => this`                       |

## Using `target`

When using `target` for selection, set `activePromptTitle`:

```javascript
// With activePromptTitle - shows "Select a creature to destroy"
this.play({
    target: {
        activePromptTitle: 'Select a creature to destroy',
        cardType: 'creature',
        gameAction: ability.actions.destroy()
    },
    effect: 'destroy {0}'
});
```

## Locales

Messages used in prompts should be in the locale files in [`public/locales`](../public/locales/). This includes:

-   `properties.target.activePromptTitle`
-   `properties.target.choices`
-   `properties.gameAction.promptForSelect.activePromptTitle`
-   `properties.gameAction.promptWithHandlerMenu.activePromptTitle`
