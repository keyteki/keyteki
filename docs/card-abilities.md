# Card Ability System

This document describes how to define card abilities in Keyteki. All card abilities are defined in the `setupCardAbilities(ability)` method of a card class.

## Table of Contents

-   [Card Ability System](#card-ability-system)
    -   [Table of Contents](#table-of-contents)
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
        -   [prophecyReaction() / prophecyInterrupt()](#prophecyreaction--prophecyinterrupt)
    -   [Common Properties](#common-properties)
    -   [Targeting](#targeting)
    -   [Conditions](#conditions)
    -   [Chaining Effects with "then"](#chaining-effects-with-then)

## Basic Structure

Every card ability follows this general pattern:

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

Triggered abilities that activate when the card is played. For action cards, the ability triggers during resolution. For creatures/artifacts/upgrades, it triggers when the card enters play.

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

Triggered abilities that activate when the creature reaps (exhausts to gain 1 aember).

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

Triggered abilities that activate when the creature fights.

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

Triggered abilities that activate when the card is destroyed. These are implemented as interrupts that trigger just before the card leaves play due to destruction.

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

Activated abilities that require the card to be exhausted to use (unless it has the "Omni" keyword).

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

"Scrap:" abilities trigger when the card is discarded from your hand (not from play). Introduced in the Grim Reminders (GR) set.

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

"Fate:" abilities trigger when revealed from the deck during specific game events, typically when drawing or discarding. Introduced in the Prophetic Visions (PV) set.

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

### prophecyReaction() / prophecyInterrupt()

Prophecy card abilities that trigger during your opponent's turn when the prophecy card is face-up in your deck. These are special reactions/interrupts for the Prophecy mechanic from the Prophetic Visions (PV) set.

```javascript
// Prophecy: Use during your opponent's turn. After a friendly creature reaps, ready it.
this.prophecyReaction({
    when: {
        onReap: (event, context) => event.card.controller === context.player
    },
    message: '{0} fulfills prophecy {1} to ready {2}',
    messageArgs: (context) => [context.player, context.source, context.event.card],
    gameAction: ability.actions.ready((context) => ({ target: context.event.card }))
});
```

```javascript
// Prophecy: At the end of your opponent's turn, fulfill this prophecy.
// Gain 1A for each friendly creature.
this.prophecyInterrupt({
    when: {
        onPhaseEnded: (event, context) => event.player !== context.player && event.phase === 'main'
    },
    gameAction: ability.actions.gainAmber((context) => ({
        amount: context.player.creaturesInPlay.length
    }))
});
```

## Common Properties

Most ability types accept these common properties:

| Property     | Description                                                          |
| ------------ | -------------------------------------------------------------------- |
| `gameAction` | The action(s) to perform. Can be a single action or an array.        |
| `target`     | Defines what the player must select as a target.                     |
| `condition`  | A function that must return true for the ability to be usable.       |
| `effect`     | Text shown in the game log. Use `{0}`, `{1}`, etc. for placeholders. |
| `effectArgs` | Arguments to fill in the effect string placeholders.                 |
| `optional`   | If true, the player can choose not to use the ability.               |
| `then`       | A follow-up ability that triggers after the main ability resolves.   |

## Targeting

The `target` property defines what the player must select:

```javascript
// Target a single creature you control
target: {
    cardType: 'creature',
    controller: 'self',
    gameAction: ability.actions.ready()
}

// Target any creature
target: {
    cardType: 'creature',
    gameAction: ability.actions.destroy()
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

## Conditions

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

## Chaining Effects with "then"

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
