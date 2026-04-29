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

Use `optional: true` when the card text says "you may" to let the player choose whether to use the ability:

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
