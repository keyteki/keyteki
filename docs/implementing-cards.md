# Implementing Cards

This guide covers the basics of implementing KeyForge cards in Keyteki. For detailed ability documentation, see:

- [Card Abilities](card-abilities.md) - Ability types and their properties
- [Game Actions](game-actions.md) - All available `ability.actions.*` methods
- [Keywords](keywords.md) - Keywords handled automatically by the engine
- [Testing Cards](testing-cards.md) - How to write tests

## Table of Contents

- [Implementing Cards](#implementing-cards)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [File Structure](#file-structure)
  - [Basic Card Template](#basic-card-template)
  - [Keywords](#keywords)
  - [Persistent Effects](#persistent-effects)
    - [Basic Persistent Effect](#basic-persistent-effect)
    - [Conditional Effects](#conditional-effects)
    - [Target Controllers](#target-controllers)
    - [Upgrade Effects](#upgrade-effects)
    - [Player Effects](#player-effects)
  - [Actions](#actions)
    - [Basic Action](#basic-action)
    - [Action with Target](#action-with-target)
    - [Omni Actions](#omni-actions)
  - [Triggered Abilities](#triggered-abilities)
    - [Reactions](#reactions)
    - [Interrupts](#interrupts)
    - [Common Trigger Events](#common-trigger-events)
  - [Targeting](#targeting)
    - [Single Target](#single-target)
    - [Multiple Targets](#multiple-targets)
    - [Target Properties](#target-properties)
    - [Card Conditions](#card-conditions)
  - [Costs](#costs)
  - [Lasting Effects](#lasting-effects)
    - [Durations](#durations)
  - [Ability Limits](#ability-limits)
  - [Message Formatting](#message-formatting)
    - [Effect Messages](#effect-messages)
    - [Effect Args](#effect-args)
    - [Message Guidelines](#message-guidelines)

## Getting Started

To implement a card:

1. Find the card's data in `keyteki-json-data/packs/<Set>.json`
2. Create a file in `server/game/cards/<Set>/<CardName>.js`
3. Implement the card's abilities
4. Write tests in `test/server/cards/<Set>/<CardName>.spec.js`

## File Structure

Cards are organized by set:

```txt
server/game/cards/
├── 01-Core/
│   ├── DustPixie.js
│   └── Troll.js
├── 02-AoA/
│   └── MightyTiger.js
├── 12-PV/
│   └── BadOmen.js
```

The filename should match the card's ID from the JSON data, converted to PascalCase.

## Basic Card Template

```javascript
const Card = require('../../Card.js');

class DustPixie extends Card {
  // Play: Gain 2A.
  setupCardAbilities(ability) {
    this.play({
      gameAction: ability.actions.gainAmber({ amount: 2 })
    });
  }
}

DustPixie.id = 'dust-pixie';

module.exports = DustPixie;
```

**Key points:**

- Extend the `Card` class
- Comment the card text above `setupCardAbilities`
- Set the static `id` property to match the JSON data
- Export the class with `module.exports`
- Always end the file with a newline

## Keywords

Keywords like Taunt, Elusive, Skirmish, etc. are automatically parsed from the card's JSON data. **Do not implement them in card code** unless they are granted conditionally by an ability.

```javascript
// DON'T do this - Taunt is automatic:
this.persistentEffect({
  effect: ability.effects.addKeyword({ taunt: 1 })
});

// DO this - only when granting keywords to OTHER cards:
this.whileAttached({
  effect: ability.effects.addKeyword({ skirmish: 1 })
});
```

## Persistent Effects

Persistent effects apply continuously while the card is in play. They automatically apply to matching cards and remove themselves when the source leaves play or becomes blank.

### Basic Persistent Effect

```javascript
// Each friendly creature gets +1 power.
this.persistentEffect({
  match: (card) => card.type === 'creature',
  targetController: 'self',
  effect: ability.effects.modifyPower(1)
});
```

### Conditional Effects

```javascript
// While you have no aember, gain +2 power.
this.persistentEffect({
  condition: (context) => context.player.amber === 0,
  match: this,
  effect: ability.effects.modifyPower(2)
});
```

### Target Controllers

- `'self'` (default) - Only your cards
- `'opponent'` - Only opponent's cards
- `'any'` - All cards regardless of controller

```javascript
// Enemy creatures get -1 power.
this.persistentEffect({
  match: (card) => card.type === 'creature',
  targetController: 'opponent',
  effect: ability.effects.modifyPower(-1)
});
```

### Upgrade Effects

For upgrades, use `whileAttached()` to apply effects to the attached creature:

```javascript
// This creature gains Skirmish.
this.whileAttached({
  effect: ability.effects.addKeyword({ skirmish: 1 })
});
```

### Player Effects

Some effects target players rather than cards:

```javascript
// Your opponent cannot play more than 2 cards each turn.
this.persistentEffect({
  condition: () => this.game.cardsPlayed.length > 1,
  targetController: 'opponent',
  effect: ability.effects.playerCannot('play')
});
```

## Actions

Action abilities require exhausting the card (unless it has Omni).

### Basic Action

```javascript
// Action: Gain 1A.
this.action({
  gameAction: ability.actions.gainAmber()
});
```

### Action with Target

```javascript
// Action: Deal 2 damage to a creature.
this.action({
  target: {
    cardType: 'creature',
    gameAction: ability.actions.dealDamage({ amount: 2 })
  }
});
```

### Omni Actions

Omni abilities can be used regardless of which house is active:

```javascript
// Omni: Sacrifice this artifact. If you do, gain 2A.
this.omni({
  gameAction: ability.actions.sacrifice(),
  then: {
    gameAction: ability.actions.gainAmber({ amount: 2 })
  }
});
```

## Triggered Abilities

### Reactions

Reactions trigger after an event occurs:

```javascript
// After a friendly creature is destroyed, gain 1A.
this.reaction({
  when: {
    onCardDestroyed: (event, context) =>
      event.card.type === 'creature' && event.card.controller === context.player
  },
  gameAction: ability.actions.gainAmber()
});
```

### Interrupts

Interrupts trigger before an event resolves:

```javascript
// Before a friendly creature would be destroyed, you may sacrifice
// this card to prevent that destruction.
this.interrupt({
  when: {
    onCardDestroyed: (event, context) =>
      event.card.type === 'creature' &&
      event.card.controller === context.player &&
      event.card !== context.source
  },
  gameAction: ability.actions.sacrifice(),
  then: {
    gameAction: ability.actions.cancel()
  }
});
```

### Common Trigger Events

| Event             | Description              |
| ----------------- | ------------------------ |
| `onCardPlayed`    | When a card is played    |
| `onCardDestroyed` | When a card is destroyed |
| `onReap`          | When a creature reaps    |
| `onFight`         | When a creature fights   |
| `onDamageDealt`   | When damage is dealt     |
| `onAmberGained`   | When aember is gained    |
| `onKeyForged`     | When a key is forged     |
| `onPhaseStarted`  | When a phase starts      |
| `onPhaseEnded`    | When a phase ends        |

## Targeting

### Single Target

```javascript
target: {
    cardType: 'creature',
    controller: 'opponent',
    gameAction: ability.actions.destroy()
}
```

### Multiple Targets

```javascript
targets: {
    first: {
        cardType: 'creature',
        controller: 'self',
        gameAction: ability.actions.ready()
    },
    second: {
        cardType: 'creature',
        controller: 'opponent',
        gameAction: ability.actions.stun()
    }
}
```

### Target Properties

| Property        | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| `cardType`      | `'creature'`, `'artifact'`, `'upgrade'`, `'action'`          |
| `controller`    | `'self'`, `'opponent'`, `'any'`                              |
| `location`      | `'play area'`, `'hand'`, `'discard'`, `'deck'`, `'archives'` |
| `cardCondition` | Function to filter valid targets                             |
| `gameAction`    | Action to apply to target                                    |

### Card Conditions

```javascript
target: {
    cardType: 'creature',
    cardCondition: (card) => card.power <= 3,
    gameAction: ability.actions.destroy()
}
```

## Costs

Some abilities have costs beyond exhausting:

```javascript
// Sacrifice a friendly creature to gain 2A.
this.action({
  cost: ability.costs.sacrifice({
    cardType: 'creature',
    controller: 'self'
  }),
  gameAction: ability.actions.gainAmber({ amount: 2 })
});
```

Common costs:

- `ability.costs.sacrifice()` - Sacrifice a card
- `ability.costs.discardCard()` - Discard from hand
- `ability.costs.payAmber(n)` - Spend aember

## Lasting Effects

Lasting effects are temporary and expire after a specified duration.

```javascript
// This creature gets +3 power until end of turn.
this.play({
  target: {
    cardType: 'creature',
    gameAction: ability.actions.cardLastingEffect({
      effect: ability.effects.modifyPower(3)
    })
  }
});
```

### Durations

- `'untilEndOfTurn'` (default)
- `'untilEndOfMyNextTurn'`
- `'untilEndOfOpponentNextTurn'`
- `'persistent'` (until card leaves play)

## Ability Limits

Some abilities can only be used a limited number of times:

```javascript
this.reaction({
  when: {
    /* ... */
  },
  limit: ability.limit.perTurn(1),
  gameAction: ability.actions.gainAmber()
});
```

Limit types:

- `ability.limit.perTurn(n)` - N times per turn
- `ability.limit.perRound(n)` - N times per round

## Message Formatting

### Effect Messages

Use the `effect` property to describe what happens:

```javascript
this.play({
  target: {
    cardType: 'creature',
    gameAction: ability.actions.destroy()
  },
  effect: 'destroy {0}'
});
```

Placeholders:

- `{0}` - First target or effect args
- `{1}`, `{2}`, etc. - Additional effect args

### Effect Args

```javascript
this.play({
  effect: 'deal {1} damage to {0}',
  effectArgs: (context) => [context.target, 3],
  target: {
    cardType: 'creature',
    gameAction: ability.actions.dealDamage({ amount: 3 })
  }
});
```

### Message Guidelines

- Start messages with the player name (handled automatically)
- Use present tense ("deals" not "dealt")
- Don't end messages with punctuation
- Keep targeting prompts short ("Choose a creature" not "Choose a creature to destroy")
