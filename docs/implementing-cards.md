
## Implementing Cards

### Getting started

To implement a card, follow these steps:

##### 1. Create a file named after the card.

Cards are organized under the `/server/game/cards` directory by grouping them by type (characters, events, etc), then by pack number.

```
/server/game/cards/attachments/01/noblelineage.js
```

#### 2. Create a class for the card and export it.

Character, location, event and attachment cards should be derived from the `DrawCard` class.

Plot cards should be derived from the `PlotCard` class.

Agenda cards should be derived from the `AgendaCard` class.

The card class should have its `code` property set to the unique card identifier for that card. You can find these combining the 2-digit pack number (01) and 3-digit card number (036), or on [thronesdb.com](https://thronesdb.com/) by looking at the URL for the specific card.

```javascript
const DrawCard = require('../../../drawcard.js');

class NobleLineage extends DrawCard {
    // Card definition
}

NobleLineage.code = '01036';

module.exports = NobleLineage;
```

#### 3. Override the `setupCardAbilities` method.

Persistent effects, actions, and triggered abilities should be defined in the `setupCardAbilities` method. This method passes in an `ability` parameter that gives you access to effect implementations and ability limits. See below for more documentation.

```javascript
class NobleLineage extends DrawCard {
    setupCardAbilities(ability) {
        // Declare persistent effects, reactions and interrupts here.
    }
}
```

### Keywords

Keywords are automatically parsed from the card text. It isn't necessary to explicitly implement them unless they are provided by a conditional persistent effect (e.g. Ser Jaime Lannister's military-only renown).

### Plot modifiers

Cards with plot modifier icons need to be declared when setting up the card using the `plotModifiers` method. The method takes an object that can have three properties: `gold` to modify the plot's gold value, `initiative` to modify the plot's initiative value, and `reserve` to modify the plot's reserve value. While most cards only provide a single modifier, it's possible to declare multiple values when appropriate.

```javascript
// The Arbor provides +3 gold.
this.plotModifiers({
    gold: 3
});

// The God's Eye provides both +1 gold and +1 reserve
this.plotModifiers({
    reserve: 1,
    gold: 1
});
```

### Persistent effects

Many cards provide continuous bonuses to other cards you control or detrimental effects to opponents cards in certain situations. These can be defined using the `persistentEffect` method. Cards that enter play while the persistent effect is in play will automatically have the effect applied, and cards that leave play will have the effect removed. If the card providing the effect becomes blank, the effect is automatically removed from all previously applied cards.

For a full list of properties that can be set when declaring an effect, look at `/server/game/effect.js`. Here are some common scenarios:

#### Matching conditions vs matching specific cards

The effect declaration takes a `match` property. In most cases this will be a function that takes a `Card` object and should return `true` if the effect should be applied to that card.

```javascript
// Each Drowned God character you control gets +1 STR.
this.persistentEffect({
    match: card => card.getType() === 'character' && card.hasTrait('Drowned God'),
    effect: ability.effects.modifyStrength(1)
});
```

In some cases, an effect should be applied to a specific card. While you could write a `match` function to match only that card, you can provide the `Card` object as a shorthand.

```javascript
// While you control another Bloodrider character, Jhogo gains stealth.
this.persistentEffect({
    condition: () => this.getNumberOfBloodriders() >= 1,
    match: this,
    effect: ability.effects.addKeyword('stealth')
});
```

#### Conditional effects

Some effects have a 'when', 'while' or 'if' clause within their text. These cards can be implemented by passing a `condition` function into the persistent effect declaration. The effect will only be applied when the function returns `true`. If the function returns `false` later on, the effect will be automatically unapplied from the cards it matched.

```javascript
// While Arya Stark has a duplicate, she gains a military icon.
this.persistentEffect({
    condition: () => this.dupes.size() >= 1,
    match: this,
    effect: ability.effects.addIcon('military')
});
```

#### Targeting opponent or all matching cards

By default, an effect will only be applied to cards controlled by the current player. The `targetController` property can be modified to specify which players' cards should be targeted.

To target only opponent cards, set `targetController` to `'opponent'`:

```javascript
// While Unsullied is attacking, each defending character gets -1 STR.
this.persistentEffect({
    condition: () => this.game.currentChallenge && this.game.currentChallenge.isAttacking(this),
    match: (card) => this.game.currentChallenge && this.game.currentChallenge.isDefending(card),
    targetController: 'opponent',
    effect: ability.effects.modifyStrength(-1)
});
```

To target all cards regardless of who controls them, set `targetController` to `'any'`:

```javascript
// Treat each character as if its printed text box were blank (except for Traits).
this.persistentEffect({
    match: card => card.getType() === 'character',
    targetController: 'any',
    effect: ability.effects.blank
});
```

#### Dynamic strengths

A few cards provide strength bonuses based on game state. For example, Core Tywin's strength is based on the amount of gold the player currently has. A `dynamicStrength` effect exists that takes a function to determine what the strength bonus is currently.

```javascript
// Tywin Lannister gets +1 STR for each gold in your gold pool.
this.persistentEffect({
    match: this,
    effect: ability.effects.dynamicStrength(() => this.controller.gold)
});
```

#### Attachment-based effects

A `whileAttached` method is provided to define persistent effects that are applied to the card an attachment is attached. These effects remain as long as the card is attached to its parent and the attachment has not been blanked.

```javascript
// Attached character gains a power icon.
this.whileAttached({
    effect: ability.effects.addIcon('power')
});
```

If the effect has an additional requirement, an optional `match` function can be passed in.
```javascript
// If attached character is Joffrey Baratheon, he gains a military icon.
this.whileAttached({
    match: card => card.name === 'Joffrey Baratheon',
    effect: ability.effects.addIcon('military')
});
```

#### Applying multiple effects at once
As a shorthand, it is possible to pass an array into the `effect` property to apply multiple effects that have the same conditions / matching functions.

```javascript
// During a challenge in which you are the defending player, Bronn gains a military, an intrigue, and a power icon.
this.persistentEffect({
    condition: () => this.game.currentChallenge && this.game.currentChallenge.defendingPlayer === this.controller,
    match: this,
    effect: [
        ability.effects.addIcon('military'),
        ability.effects.addIcon('intrigue'),
        ability.effects.addIcon('power')
    ]
});
```

#### Player modifying effects

Certain cards provide bonuses or restrictions on the player itself instead of on any specific cards. These can be implemented setting the `targetType` to `'player'` and using the appropriate effect.

```javascript
// You may initiate an additional  challenge during the challenges phase.
this.persistentEffect({
    targetType: 'player',
    targetController: 'current',
    effect: ability.effects.modifyChallengeTypeLimit('military', 1)
});
```

### Lasting effects

Unlike persistent effects, lasting effects are typically applied during an action, reaction or interrupt and expire after a specified period of time.  Because lasting effects can be applied almost anywhere, each method takes a factory function that provides the `ability` object and should return the effect properties. The properties returned when applying these effects are identical to those of persistent effects, but additional methods are provided to apply them immediately with the correct duration.

**Important: These should not be used within setupCardAbilities, only within handler code for actions and triggered abilities.**

To apply an effect to last until the end of the current challenge, use `untilEndOfChallenge`:
```javascript
// Until the end of the challenge, the character this is attached to gains +3 STR
this.untilEndOfChallenge(ability => ({
    match: card => card === this.parent,
    effect: ability.effects.modifyStrength(3)
}));
```

To apply an effect to last until the end of the current phase, use `untilEndOfPhase`:
```javascript
// Until the end of the phase, the current player can initiate an additional power challenge.
this.untilEndOfPhase(ability => ({
    targetType: 'player',
    targetController: 'current',
    effect: ability.effects.modifyChallengeTypeLimit('power', 1)
}));
```

To apply an effect that will expire 'at the end of the phase', use `atEndOfPhase`:
```javascript
// At the end of the phase, if card is still in play discard it from play (cannot be saved)
this.atEndOfPhase(ability => ({
    match: card,
    effect: ability.effects.discardIfStillInPlay(false)
}));
```

To apply an effect to last until the end of the round, use `untilEndOfRound`:
```javascript
/// Until the end of the round, add the 'Winter' trait to the specified plot card.
this.untilEndOfRound(ability => ({
    match: plotCard,
    effect: ability.effects.addTrait('Winter')
}));
```

### Actions

**Note:** Actions may be reworked in the future to separate out the action's cost from the action's effect. So this API may change slightly.

Actions are abilities provided by the card text that players may trigger during action windows. They are declared using the `action` method. See `/server/game/cardaction.js` for full documentation. Here are some common scenarios:

#### Declaring an action

When declaring an action, use the `action` method and provide it with a `title` and a `method` property. The title is what will be displayed in the menu players see when clicking on the card. The method is a string that references a method on the card object to be called when the player chooses to trigger the action. The player executing the action is passed into the method.

```javascript
class SealOfTheHand extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Stand attached character',
            method: 'kneel'
        });
    }

    kneel(player) {
        // Code to stand the parent card.
    }
}
```

#### Cancelling an action due to cost

Some actions have an additional cost or requirement, such as kneeling the card. In these cases, if the cost cannot be paid, returning false from the handler will cancel the action.

```javascript
// Handler method for Seal of the Hand
kneel(player) {
    // ensure the parent is kneeled and the Seal is standing.
    if(!this.parent || !this.parent.kneeled || this.kneeled) {
        return false;
    }

    // stand parent, kneel this.
}
```

If an action is cancelled in this manner, it is not counted towards any 'limit X per challenge/phase/round' requirements.

#### Limiting an action to a specific phase

Some actions are limited to a specific phase by their card text (e.g. 'Challenges Action:'). You can pass an optional `phase` property to the action to limit it to just that phase. Valid phases include `'plot'`, `'draw'`, `'marshal'`, `'challenges'`, `'dominance'`, `'standing'` `'taxation'`. The default is `'any'` which allows the action to be triggered in any phase.

```javascript
this.action({
    title: 'Kneel Grey Wind to kill a character',
    method: 'kill',
    phase: 'challenge'
});
```

#### Limiting the number of uses

Some actions have text limiting the number of times they may be used in a given period. You can pass an optional `limit` property using one of the duration-specific ability limiters.

```javascript
this.action({
    title: 'Put a card with printed cost of 5 or lower in play',
    method: 'putInPlay',
    limit: ability.limit.perPhase(1)
});
```

### Triggered abilities

TODO

### Ability limits

Actions, reactions, and interrupts can have limits on how many times they may be used within a certain period. These limits can be set by setting the `limit` property on the ability. The `ability` object has a limit helper with methods for the different periods.

To limit an ability per challenge, use `ability.limit.perChallenge(x)`.

To limit an ability per phase, use `ability.limit.perPhase(x)`.

To limit an ability per challenge, use `ability.limit.perRound(x)`.

In each case, `x` should be the number of times the ability is allowed to be used.
