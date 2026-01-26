# Implementing Cards

This guide covers the basics of implementing KeyForge cards in Keyteki. For detailed ability documentation, see:

-   [Card Abilities](card-abilities.md) - Ability types and their properties
-   [Game Actions](game-actions.md) - All available `ability.actions.*` methods
-   [Keywords](keywords.md) - Keywords handled automatically by the engine
-   [Testing Cards](testing-cards.md) - How to write tests

## Table of Contents

-   [Getting Started](#getting-started)
    -   [Testing in the UI](#testing-in-the-ui)
-   [File Structure](#file-structure)
-   [Basic Card Template](#basic-card-template)
-   [Keywords](#keywords)
-   [Persistent Effects](#persistent-effects)
    -   [Basic Persistent Effect](#basic-persistent-effect)
    -   [Conditional Effects](#conditional-effects)
    -   [Target Controllers](#target-controllers)
    -   [Upgrade Effects](#upgrade-effects)
    -   [Player Effects](#player-effects)
-   [Actions](#actions)
    -   [Basic Action](#basic-action)
    -   [Action with Target](#action-with-target)
    -   [Omni Actions](#omni-actions)
-   [Triggered Abilities](#triggered-abilities)
    -   [Reactions](#reactions)
    -   [Interrupts](#interrupts)
    -   [Trigger Events](#trigger-events)
-   [Targeting](#targeting)
    -   [Single Target](#single-target)
    -   [Multiple Targets](#multiple-targets)
    -   [Target Properties](#target-properties)
    -   [Card Conditions](#card-conditions)
-   [Costs](#costs)
-   [Lasting Effects](#lasting-effects)
    -   [Durations](#durations)
-   [Ability Limits](#ability-limits)

## Getting Started

To implement a card:

-   Find the card's data in `keyteki-json-data/packs/<Set>.json`
-   Create a file in `server/game/cards/<Set>/<CardName>.js`
-   Implement the card's abilities
-   Write tests in `test/server/cards/<Set>/<CardName>.spec.js`
-   Run and verify tests pass: `DEBUG_TEST=1 npm test -- test/server/cards/<Set>/<CardName>.spec.js`

### Testing in the UI

-   Start the server: `docker-compose up --build`
-   Visit [http://localhost:4000](http://localhost:4000)
-   Create a game and enter manual mode
-   Add your card: `/add-card Card Name`

## File Structure

Cards are organized by set:

```txt
server/game/cards/
├── AoA/
│   └── MightyTiger.js
├── CotA/
│   ├── DustPixie.js
├── PV/
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

-   Extend the `Card` class
-   Comment the card text above `setupCardAbilities`
-   Set the static `id` property to match the JSON data
-   Export the class with `module.exports`
-   Always end the file with a newline

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

-   `'self'` (default) - Only your cards
-   `'opponent'` - Only opponent's cards
-   `'any'` - All cards regardless of controller

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

When a card uses an action ability, the card must be ready, is then exhausted, and then the ability resolves. Any after use effects the occur after the ability resolves.

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

### Trigger Events

These events are used in `reaction()` and `interrupt()` abilities:

| Event                 | Description                                          | Key Event Properties                                   |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------------ |
| `onCardPlayed`        | When a card is played                                | `event.card`, `event.player`, `event.originalLocation` |
| `onCardDestroyed`     | When a card is destroyed                             | `event.card`, `event.damageEvent`                      |
| `onCardEntersPlay`    | When a card enters play                              | `event.card`                                           |
| `onCardLeavesPlay`    | When a card leaves play                              | `event.card`, `event.triggeringEvent`                  |
| `onCardDiscarded`     | When a card is discarded                             | `event.card`, `event.location`                         |
| `onReap`              | When a creature reaps                                | `event.card`                                           |
| `onFight`             | When a creature fights (and survives to deal damage) | `event.card` (defender), `event.attacker`              |
| `onUseCard`           | When a card is used (fight, reap, action, unstun)    | `event.card`, `event.fight`, `event.fightEvent`        |
| `onDamageDealt`       | When damage is dealt to a creature                   | `event.card`, `event.amount`, `event.damageSource`     |
| `onDamageApplied`     | When damage tokens are applied                       | `event.card`, `event.amount`, `event.destroyEvent`     |
| `onModifyAmber`       | When a player gains or loses aember                  | `event.player`, `event.amount`, `event.reap`           |
| `onStealAmber`        | When aember is stolen                                | `event.player` (victim), `event.amount`                |
| `onCapture`           | When aember is captured                              | `event.card`, `event.amount`                           |
| `onForgeKey`          | When a key is forged                                 | `event.player`, `event.modifier`                       |
| `onDrawCards`         | When cards are drawn                                 | `event.player`, `event.amount`                         |
| `onDeckShuffled`      | When a deck is shuffled                              | `event.player`, `event.shuffledDiscardIntoDeck`        |
| `onTurnStart`         | At the start of a turn                               | `event.player`                                         |
| `onTurnEnd`           | At the end of a turn                                 | `event.player`                                         |
| `onPhaseStarted`      | When a phase starts                                  | `event.phase` (`'main'`, `'house'`, etc.)              |
| `onPhaseEnd`          | When a phase ends                                    | `event.phase`                                          |
| `onChooseActiveHouse` | When active house is chosen                          | `event.player`, `event.house`                          |
| `onStun`              | When a creature is stunned                           | `event.card`                                           |
| `onCardReadied`       | When a card is readied                               | `event.card`, `event.exhausted`                        |
| `onHeal`              | When a creature is healed                            | `event.card`, `event.amount`                           |
| `onWard`              | When a creature is warded                            | `event.card`                                           |
| `onExalt`             | When a creature is exalted                           | `event.card`, `event.amount`                           |
| `onRaiseTide`         | When the tide is raised                              | `event.player`                                         |
| `onCardArchived`      | When a card is archived                              | `event.card`                                           |
| `onCardPurged`        | When a card is purged                                | `event.card`                                           |

For a complete list of events and their parameters, see [types.js](../server/game/Events/types.js).

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

The `cardCondition` property accepts a function `(card, context) => boolean` that filters which cards are valid targets. It receives the potential target card and the ability context.

**Basic property checks:**

```javascript
// Target a creature with power 3 or less
cardCondition: (card) => card.power <= 3;

// Target a creature with no damage
cardCondition: (card) => !card.hasToken('damage');

// Target a creature with aember on it
cardCondition: (card) => card.hasToken('amber');
```

**Trait and house checks:**

```javascript
// Target a creature with the 'giant' trait
cardCondition: (card) => card.hasTrait('giant');

// Target a non-Mars creature
cardCondition: (card) => !card.hasHouse('mars');

// Target a Mars Agent creature
cardCondition: (card) => card.hasTrait('agent') && card.hasHouse('mars');
```

**Position-based conditions:**

```javascript
// Target a creature on a flank
cardCondition: (card) => card.isOnFlank();

// Target a neighbor of this creature
cardCondition: (card, context) => context.source.neighbors.includes(card);
```

**Excluding the source card:**

```javascript
// Target any creature except this one
cardCondition: (card, context) => card !== context.source;
```

**Using context for complex conditions:**

```javascript
// Target based on another target selection
cardCondition: (card, context) => card.neighbors.includes(context.targets.first);

// Target based on source card state
cardCondition: (_, context) => context.source.hasToken('wisdom');
```

**Card name checks:**

```javascript
// Target a specific card by name
cardCondition: (card) => card.name === 'Nautilixian';
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

-   `ability.costs.sacrifice()` - Sacrifice a card
-   `ability.costs.discardCard()` - Discard from hand
-   `ability.costs.payAmber(n)` - Spend aember

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

-   `'untilEndOfTurn'` (default)
-   `'untilEndOfMyNextTurn'`
-   `'untilEndOfOpponentNextTurn'`
-   `'persistent'` (until card leaves play)

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

-   `ability.limit.perTurn(n)` - N times per turn
-   `ability.limit.perRound(n)` - N times per round
