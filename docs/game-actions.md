# Game Actions Reference

Game actions are the atomic operations that modify game state. They are accessed through `ability.actions.*` in card ability definitions.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Card Actions](#card-actions)
  - [archive({ target })](#archive-target-)
  - [capture({ amount })](#capture-amount-)
  - [dealDamage({ amount, target })](#dealdamage-amount-target-)
  - [destroy({ target })](#destroy-target-)
  - [discard({ target })](#discard-target-)
  - [enrage({ target })](#enrage-target-)
  - [exalt({ amount })](#exalt-amount-)
  - [exhaust({ target })](#exhaust-target-)
  - [fight({ target })](#fight-target-)
  - [heal({ amount, target })](#heal-amount-target-)
  - [moveToFlank({ target, left })](#movetoflank-target-left-)
  - [placeAmber({ amount })](#placeamber-amount-)
  - [placeUnder({ parent })](#placeunder-parent-)
  - [purge({ target })](#purge-target-)
  - [putIntoPlay({ target })](#putintoplay-target-)
  - [ready({ target })](#ready-target-)
  - [reap({ target })](#reap-target-)
  - [removeStun({ target })](#removestun-target-)
  - [removeWard({ target })](#removeward-target-)
  - [returnToDeck({ bottom, shuffle })](#returntodeck-bottom-shuffle-)
  - [returnToHand({ target })](#returntohand-target-)
  - [sacrifice({ target })](#sacrifice-target-)
  - [stun({ target })](#stun-target-)
  - [swap({ origin })](#swap-origin-)
  - [use({ target })](#use-target-)
  - [ward({ target })](#ward-target-)
- [Player Actions](#player-actions)
  - [chosenDiscard({ amount })](#chosendiscard-amount-)
  - [discardAtRandom({ amount })](#discardatrandom-amount-)
  - [discardTopOfDeck({ amount })](#discardtopofdeck-amount-)
  - [draw({ amount })](#draw-amount-)
  - [forgeKey({ modifier })](#forgekey-modifier-)
  - [gainAmber({ amount })](#gainamber-amount-)
  - [gainChains({ amount })](#gainchains-amount-)
  - [loseAmber({ amount })](#loseamber-amount-)
  - [makeTokenCreature({ amount })](#maketokencreature-amount-)
  - [steal({ amount })](#steal-amount-)
  - [shuffleDeck()](#shuffledeck)
- [Token Actions](#token-actions)
  - [addPowerCounter({ amount })](#addpowercounter-amount-)
  - [addDamageToken({ amount })](#adddamagetoken-amount-)
  - [removeDamage({ amount })](#removedamage-amount-)
  - [removeAmber({ amount })](#removeamber-amount-)
- [Meta Actions](#meta-actions)
  - [sequential(gameActions)](#sequentialgameactions)
  - [chooseAction({ choices })](#chooseaction-choices-)
  - [conditional({ condition, trueGameAction, falseGameAction })](#conditional-condition-truegameaction-falsegameaction-)
- [Lasting Effect Actions](#lasting-effect-actions)
  - [cardLastingEffect({ duration, effect })](#cardlastingeffect-duration-effect-)
  - [untilPlayerTurnEnd({ effect })](#untilplayerturnend-effect-)
  - [duringOpponentNextTurn({ effect })](#duringopponentnextturn-effect-)
- [Dynamic Properties](#dynamic-properties)

## Basic Usage

Actions are used in the `gameAction` property of abilities:

```javascript
// Single action
this.play({
  gameAction: ability.actions.gainAmber({ amount: 2 })
});

// Multiple actions (executed simultaneously)
this.play({
  gameAction: [
    ability.actions.destroy((context) => ({ target: context.game.creaturesInPlay })),
    ability.actions.gainChains({ amount: 3 })
  ]
});

// Sequential actions (executed in order)
this.play({
  target: {
    cardType: 'creature',
    gameAction: ability.actions.sequential([ability.actions.ready(), ability.actions.fight()])
  }
});
```

## Card Actions

Actions that affect cards in play or in other zones.

### archive({ target })

Archive cards (move to archives face-down).

```javascript
// Archive a card you control
ability.actions.archive();

// Archive a specific target
ability.actions.archive({ target: someCard });
```

### capture({ amount })

Capture aember from opponent onto a creature.

```javascript
// Capture 1A (default)
ability.actions.capture();

// Capture 3A
ability.actions.capture({ amount: 3 });

// Capture all opponent's aember
ability.actions.capture((context) => ({
  amount: context.player.opponent.amber
}));
```

### dealDamage({ amount, target })

Deal damage to creatures.

```javascript
// Deal 2 damage
ability.actions.dealDamage({ amount: 2 });

// Deal damage equal to card's power
ability.actions.dealDamage((context) => ({
  amount: context.source.power
}));

// Deal damage to all enemy creatures
ability.actions.dealDamage((context) => ({
  amount: 2,
  target: context.game.creaturesInPlay.filter((c) => c.controller !== context.player)
}));
```

### destroy({ target })

Destroy cards.

```javascript
// Destroy target
ability.actions.destroy();

// Destroy all creatures
ability.actions.destroy((context) => ({
  target: context.game.creaturesInPlay
}));
```

### discard({ target })

Discard cards from hand or play.

```javascript
// Discard target
ability.actions.discard();

// Discard from a specific location
ability.actions.discard({ location: 'hand' });
```

### enrage({ target })

Enrage creatures (must fight if able).

```javascript
ability.actions.enrage();
```

### exalt({ amount })

Place aember from common supply onto a creature.

```javascript
// Exalt 1 (default)
ability.actions.exalt();

// Exalt 2
ability.actions.exalt({ amount: 2 });
```

### exhaust({ target })

Exhaust cards.

```javascript
ability.actions.exhaust();
```

### fight({ target })

Make a creature fight.

```javascript
ability.actions.fight();
```

### heal({ amount, target })

Remove damage from creatures.

```javascript
// Heal 2 damage
ability.actions.heal({ amount: 2 });

// Fully heal
ability.actions.heal({ fully: true });
```

### moveToFlank({ target, left })

Move a creature to a flank.

```javascript
// Move to left flank
ability.actions.moveToFlank({ left: true });

// Move to right flank
ability.actions.moveToFlank({ left: false });
```

### placeAmber({ amount })

Place aember on a card (not capture - from supply).

```javascript
ability.actions.placeAmber({ amount: 1 });
```

### placeUnder({ parent })

Place a card under another card.

```javascript
ability.actions.placeUnder((context) => ({
  parent: context.source
}));
```

### purge({ target })

Remove cards from the game.

```javascript
// Purge target
ability.actions.purge();

// Purge and track which card purged it
ability.actions.purge((context) => ({
  purgedBy: context.source
}));
```

### putIntoPlay({ target })

Put a card into play from any zone.

```javascript
ability.actions.putIntoPlay();
```

### ready({ target })

Ready exhausted cards.

```javascript
ability.actions.ready();
```

### reap({ target })

Make a creature reap.

```javascript
ability.actions.reap();
```

### removeStun({ target })

Remove stun from creatures.

```javascript
ability.actions.removeStun();
```

### removeWard({ target })

Remove ward from creatures.

```javascript
ability.actions.removeWard();
```

### returnToDeck({ bottom, shuffle })

Return cards to deck.

```javascript
// Return to top of deck
ability.actions.returnToDeck();

// Return to bottom of deck
ability.actions.returnToDeck({ bottom: true });

// Shuffle into deck
ability.actions.returnToDeck({ shuffle: true });
```

### returnToHand({ target })

Return cards to owner's hand.

```javascript
// Return target to hand
ability.actions.returnToHand();

// Return all Mars creatures to hand
ability.actions.returnToHand((context) => ({
  target: context.game.creaturesInPlay.filter((card) => card.hasHouse('mars'))
}));
```

### sacrifice({ target })

Destroy a card you control (bypass destruction prevention).

```javascript
ability.actions.sacrifice();
```

### stun({ target })

Stun creatures.

```javascript
ability.actions.stun();
```

### swap({ origin })

Swap positions of two creatures.

```javascript
ability.actions.swap((context) => ({
  origin: context.source
}));
```

### use({ target })

Use a card (exhaust and trigger its "use" abilities).

```javascript
ability.actions.use();
```

### ward({ target })

Ward creatures.

```javascript
ability.actions.ward();
```

## Player Actions

Actions that affect players rather than specific cards.

### chosenDiscard({ amount })

Make a player choose and discard cards from hand.

```javascript
// Discard 1 card
ability.actions.chosenDiscard();

// Discard 2 cards
ability.actions.chosenDiscard({ amount: 2 });
```

### discardAtRandom({ amount })

Discard random cards from hand.

```javascript
// Discard 1 random card
ability.actions.discardAtRandom();

// Discard 2 random cards
ability.actions.discardAtRandom({ amount: 2 });
```

### discardTopOfDeck({ amount })

Discard cards from top of deck.

```javascript
ability.actions.discardTopOfDeck({ amount: 3 });
```

### draw({ amount })

Draw cards.

```javascript
// Draw 1 card (default)
ability.actions.draw();

// Draw 2 cards
ability.actions.draw({ amount: 2 });
```

### forgeKey({ modifier })

Forge a key.

```javascript
// Forge at current cost
ability.actions.forgeKey();

// Forge with modified cost
ability.actions.forgeKey({ modifier: -2 });

// Forge with cost based on game state
ability.actions.forgeKey((context) => ({
  modifier: 9 - context.player.hand.length
}));
```

### gainAmber({ amount })

Gain aember.

```javascript
// Gain 1A (default)
ability.actions.gainAmber();

// Gain 2A
ability.actions.gainAmber({ amount: 2 });
```

### gainChains({ amount })

Gain chains.

```javascript
ability.actions.gainChains({ amount: 3 });
```

### loseAmber({ amount })

Lose aember (returns to common supply).

```javascript
ability.actions.loseAmber({ amount: 2 });
```

### makeTokenCreature({ amount })

Create token creatures.

```javascript
// Create 1 token creature
ability.actions.makeTokenCreature();

// Create 3 token creatures
ability.actions.makeTokenCreature({ amount: 3 });
```

### steal({ amount })

Steal aember from opponent.

```javascript
// Steal 1A (default)
ability.actions.steal();

// Steal 2A
ability.actions.steal({ amount: 2 });
```

### shuffleDeck()

Shuffle a player's deck.

```javascript
ability.actions.shuffleDeck();
```

## Token Actions

Actions for managing tokens/counters on cards.

### addPowerCounter({ amount })

Add +1 power counters.

```javascript
ability.actions.addPowerCounter({ amount: 1 });
```

### addDamageToken({ amount })

Add damage tokens.

```javascript
ability.actions.addDamageToken({ amount: 2 });
```

### removeDamage({ amount })

Remove damage tokens.

```javascript
ability.actions.removeDamage({ amount: 2 });
```

### removeAmber({ amount })

Remove aember from a card.

```javascript
ability.actions.removeAmber({ amount: 1 });
```

## Meta Actions

Actions that combine or sequence other actions.

### sequential(gameActions)

Execute actions in sequence (one after another).

```javascript
ability.actions.sequential([ability.actions.ready(), ability.actions.fight()]);
```

### chooseAction({ choices })

Let the player choose between multiple actions.

```javascript
ability.actions.chooseAction({
  choices: {
    'Gain 2 Aember': ability.actions.gainAmber({ amount: 2 }),
    'Draw 2 cards': ability.actions.draw({ amount: 2 })
  }
});
```

### conditional({ condition, trueGameAction, falseGameAction })

Execute different actions based on a condition.

```javascript
ability.actions.conditional({
  condition: (context) => context.player.amber >= 6,
  trueGameAction: ability.actions.forgeKey(),
  falseGameAction: ability.actions.gainAmber({ amount: 2 })
});
```

## Lasting Effect Actions

Actions that create temporary effects.

### cardLastingEffect({ duration, effect })

Apply a lasting effect to a card.

```javascript
ability.actions.cardLastingEffect({
  duration: 'untilPlayerTurnEnd',
  effect: ability.effects.modifyPower(3)
});
```

### untilPlayerTurnEnd({ effect })

Apply an effect until end of the current player's turn.

```javascript
ability.actions.untilPlayerTurnEnd({
  targetController: 'opponent',
  effect: ability.effects.modifyKeyCost(2)
});
```

### duringOpponentNextTurn({ effect })

Apply an effect during the opponent's next turn.

```javascript
ability.actions.duringOpponentNextTurn({
  targetController: 'any',
  effect: ability.effects.modifyKeyCost(3)
});
```

## Dynamic Properties

Most actions accept either static values or functions that receive the context:

```javascript
// Static value
ability.actions.dealDamage({ amount: 2 });

// Dynamic value based on context
ability.actions.dealDamage((context) => ({
  amount: context.source.power
}));

// Dynamic target
ability.actions.destroy((context) => ({
  target: context.game.creaturesInPlay.filter((c) => c.power <= 3)
}));
```

The context object contains:

- `context.source` - The card triggering the ability
- `context.player` - The player who controls the source
- `context.game` - The game state
- `context.target` - The selected target (if targeting was used)
- `context.event` - The triggering event (for reactions/interrupts)
