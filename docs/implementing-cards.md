
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

Certain cards may apply effects that need to be recalculated mid-challenge. For example, Robert Baratheon's strength is based on how many other characters are kneeling, so declaring him in a challenge along with other characters will change his strength. For such scenarios, pass the optional `recalculateWhen` property as an array of event names for which the effect should be recalculated. **Note:** this mechanism should be used sparingly if possible and only with problematic cards.

```javascript
// Robert Baratheon gets +1 STR for each other kneeling character in play.
this.persistentEffect({
    match: this,
    // Recalculate the effect whenever a card stands or kneels.
    recalculateWhen: ['onCardStood', 'onCardKneeled'],
    effect: ability.effects.dynamicStrength(() => this.calculateStrength())
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

#### Applying effects to cards in hand

By default, effects will only be applied to cards in the play area.  Certain cards effects refer to cards in your hand, such as reducing their cost or providing ambush to matching cards. In these cases, set the `targetLocation` property to `'hand'`.

```javascript
// Each Direwolf card in your hand gains ambush (X). X is that card's printed cost.
this.persistentEffect({
    // Explicitly target the effect to cards in hand.
    targetLocation: 'hand',
    match: card => card.hasTrait('Direwolf'),
    effect: ability.effects.gainAmbush()
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

Actions are abilities provided by the card text that players may trigger during action windows. They are declared using the `action` method. See `/server/game/cardaction.js` for full documentation. Here are some common scenarios:

#### Declaring an action

When declaring an action, use the `action` method and provide it with a `title` and a `handler` property. The title is what will be displayed in the menu players see when clicking on the card. The handler is a function to be called when the player chooses to trigger the action. The handler receives a context object as its only parameter which contains the `player` executing the action, and the `source` card that triggered the ability.

```javascript
class SealOfTheHand extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand attached character',
            handler: context => {
                // Code to stand the parent card
            }
        });
    }
}
```

#### DEPRECATED - Specifying handler using `method` property.

**Note:** This syntax is being phased out. Prefer using `handler` instead.

You can specify a method on the card to call instead of a specific handler function by using the `method` property. The method is a string that references a method on the card object to be called when the player chooses to trigger the action. The player executing the action is passed into the method.

#### Checking ability restrictions

Card abilities can only be triggered if they have the potential to modify game state (outside of paying costs). To ensure that the action's play restrictions are met, pass a `condition` function that returns `true` when the restrictions are met, and `false` otherwise. If the condition returns `false`, the action will not be executed and costs will not be paid.

```javascript
this.action({
    title: 'Stand attached character',
    // Ensure that the parent card is knelt
    condition: () => this.parent.kneeled,
    // ...
});
```

#### Paying additional costs for action

Some actions have an additional cost, such as kneeling the card. In these cases, specify the `cost` parameter. The action will check if the cost can be paid. If it can't, the action will not execute. If it can, costs will be paid automatically and then the action will execute.

For a full list of costs, look at `/server/game/costs.js`.

```javascript
this.action({
    title: 'Stand attached character',
    // This card must be knelt as a cost for the action.
    cost: ability.costs.kneelSelf(),
    // ...
});
```

If a card has multiple costs, an array of cost objects may be sent using the `cost` property.

```javascript
this.action({
    title: 'Reduce the next character marshalled by 3',
    // This card must be knelt AND sacrificed as a cost for the action.
    cost: [
        ability.costs.kneelSelf(),
        ability.costs.sacrificeSelf()
    ],
    // ...
});
```

#### Choosing / targeting cards

Cards that specify to 'choose' or otherwise target a specific card can be implemented by passing a `target` property, At minimum, the target property must have an `activePromptTitle` to be used as the prompt text, and a `cardCondition` function that returns `true` for valid targets. Any other properties that apply to `Game.promptForSelect` are valid.

```javascript
this.action({
    title: 'Stand a Bloodrider (if a Summer plot is revealed)',
    target: {
        activePromptTitle: 'Select a character',
        cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.hasTrait('Bloodrider')
    },
    // ...
});
```

The card that was chosen will be set on the `target` property of the context object passed to the handler.

```javascript
this.action({
    // ...
    handler: context => {
        this.game.addMessage('{0} uses {1} to stand {2}', context.player, this, context.target);
        this.controller.standCard(context.target);
    }
});
```

Some card abilities require multiple targets. These may be specified using the `targets` property. Each sub key under `targets` is the name that will be given to the chosen card, and the value is the prompt properties.

```javascript
this.action({
    title: 'Kneel this card to modify the strength of two characters',
    targets: {
        toLower: {
            activePromptTitle: 'Select a character to get -1 STR',
            cardCondition: card => this.cardCondition(card)
        },
        toRaise: {
            activePromptTitle: 'Select a character to get +1 STR',
            cardCondition: card => this.cardCondition(card)
        }
    },
    // ...
});
```

Once all targets are chosen, they will be set using their specified name under the `targets` property on the handler context object.

```javascript
this.action({
    // ...
    handler: context => {
        this.untilEndOfPhase(ability => ({
            match: context.targets.toLower,
            effect: ability.effects.modifyStrength(-1)
        }));
        this.untilEndOfPhase(ability => ({
            match: context.targets.toRaise,
            effect: ability.effects.modifyStrength(1)
        }));
    }
});
```

#### Cancelling an action

If after checking play requirements and paying costs an action needs to be cancelled for some reason, simply return `false` from the handler. **Note**: This should be very rare.

```javascript
this.action({
    title: 'Do something',
    handler: () => {
        if(!this.canDoIt()) {
            return false;
        }

        // normal handler code
    }
});
```

If an action is cancelled in this manner, it is not counted towards any 'limit X per challenge/phase/round' requirements.

#### Limiting an action to a specific phase

Some actions are limited to a specific phase by their card text (e.g. 'Challenges Action:'). You can pass an optional `phase` property to the action to limit it to just that phase. Valid phases include `'plot'`, `'draw'`, `'marshal'`, `'challenge'`, `'dominance'`, `'standing'` `'taxation'`. The default is `'any'` which allows the action to be triggered in any phase.

```javascript
this.action({
    title: 'Kneel Grey Wind to kill a character',
    phase: 'challenge',
    // ...
});
```

#### Limiting the number of uses

Some actions have text limiting the number of times they may be used in a given period. You can pass an optional `limit` property using one of the duration-specific ability limiters.

```javascript
this.action({
    title: 'Put a card with printed cost of 5 or lower in play',
    limit: ability.limit.perPhase(1),
    // ...
});
```

#### Actions outside of play

Certain actions, such as those for Dolorous Edd, can only be activated while the character is in hand. Such actions should be defined by specifying the `location` property with the location from which the ability may be activated. The player can then activate the ability by simply clicking the card. If there is a conflict (e.g. both the ability and normal marshaling can occur), then the player will be prompted.

```javascript
this.action({
    title: 'Add Dolorous Edd as a defender',
    location: 'hand',
    // ...
})
```

### Triggered abilities

Triggered abilities include all card abilities that have **Interrupt**, **Forced Interrupt**, **Reaction**, **Forced Reaction**, or **When Revealed**. For full documentation of properties, see `/server/game/promptedtriggeredability.js` and `/server/game/forcedtriggeredability.js`. Here are some common scenarios:

#### Defining the triggering condition

Each triggered ability has an associated triggering condition. This is done using the `when` property. This should be an object whose sub-property is the name of the event, and whose value is a function with the parameters of that event. When the function returns `true`, the ability will be executed.

```javascript
this.interrupt({
    when: {
	    // when the challenges phase ends and the card is not kneeled
        onPhaseEnded: (e, phase) => phase === 'challenge' && !this.kneeled
    },
    handler: () => {
        // handler code.
    }
});
```

In rare cases, there may be multiple triggering conditions for the same ability. For example, WotN Catelyn Stark gains power whenever a character is killed OR sacrificed. In these cases, just defined an additional event on the `when` object.

```javascript
this.reaction({
    when: {
        onSacrificed: (event, player, card) => this.starkCharacterSacrificedOrKilled(event, player, card),
        onCharacterKilled: (event, player, card) => this.starkCharacterSacrificedOrKilled(event, player, card)
    },
    handler: () => {
        // gain power
    }
});
```

#### Forced reactions and interrupts

Forced reactions and interrupts do not provide the player with a choice - unless cancelled, the provided `handler` method will always be executed.

To declare a forced reaction, use the `forcedReaction` method:

```javascript
// After you lose an unopposed challenge, kneel The Wall.
this.forcedReaction({
    when: {
        // lost an unopposed challenge
    },
    handler: () => {
        // kneel the Wall.
    }
});
```

To declare a forced interrupt, use the `forcedInterrupt` method.

```javascript
// When a phase ends in which Gold Cloaks entered play using ambush, discard it from play (cannot be saved)
this.forcedInterrupt({
    when: {
        // the card entered play via ambush
    },
    handler: () => {
        // discard the card
    }
});
```

#### Cancelling or replacing events with interrupts

Some cards (primarily saving cards) allow the player to cancel an effect. The `handler` method is always passed a `context` object that allows the handler to cancel the event. Such abilities must also be passed `canCancel: true` in the declaration.

```javascript
this.interrupt({
    when: {
        // attached character would be killed + allowed to save
    },
    canCancel: true,
    handler: (context) => {
        context.cancel();
        // sacrifice the Bodyguard
    }
});
```

In other cases, abilities contain the word 'instead' to indicate that the event will not be cancelled, but the normal effect will be replaced. In these case, `context.skipHandler()` can be called to replace the effect.

```javascript
this.interrupt({
    when: {
        // claim is applied and Mirri is attacking alone
    },
    handler: context => {
        context.skipHandler();
        // prompt the player to select a character to kill
    }
});
```

#### Yes / no reactions and interrupts

Most reactions and interrupt are a yes / no choice on whether the player wants to activate the ability or not. For these, it's only necessary to provide a `when` event listener and the `handler` method, similar to forced reactions and interrupts.

To declare a reaction, use the `reaction` method.

```javascript
this.reaction({
    when: {
        // triggering event condition
    }
    handler: () => {
        // code to implement the ability
    }
});
```

To declare an interrupt, use the `interrupt` method.

```javascript
this.interrupt({
    when: {
        // triggering event condition
    }
    handler: () => {
        // code to implement the ability
    }
});
```

#### Multiple choice reactions and interrupts

A few cards provide reactions or interrupts that have more than a yes or no choice. For example, the Great Kraken can be used to draw a card, gain power, or declined. In these cases, instead of sending a `handler` method, a `choices` object may be provided. Each property under the `choices` object will be used as the prompt button text, while the value will be the function to be executed if the player chooses that option. The option to decline / cancel the ability is provided automatically and does not need to be added to the `choices` object.

```javascript
this.reaction({
    when: {
        // unopposed win
    },
    choices: {
        'Draw 1 card': () => {
            // code to draw a card
        },
        'Gain 1 power': () => {
            // code to gain 1 power
        }
    }
});
```

#### Paying additional costs for reactions and interrupts

Some abilities have an additional cost, such as kneeling the card. In these cases, specify the `cost` parameter. The ability will check if the cost can be paid. If it can't, the ability will not prompt the player. If it can, costs will be paid automatically and then the ability will execute.

For a full list of costs, look at `/server/game/costs.js`.

```javascript
this.interrupt({
    when: {
        // condition for the Wall.
    }
    // This card must be knelt as a cost for the action.
    cost: ability.costs.kneelSelf(),
    handler: () => {
        // Gain 2 power for your faction.
    }
});
```

If a card has multiple costs, an array of cost objects may be sent using the `cost` property.

```javascript
this.reaction({
    when {
        // condition for Ghaston Grey
    }
    // This card must be knelt AND sacrificed as a cost for the action.
    cost: [
        ability.costs.kneelSelf(),
        ability.costs.sacrificeSelf()
    ],
    handler: () => {
        // Choose and return an attacking character to your opponent's hand.
    }
});
```

#### Changing the title of the reaction / interrupt button

By default, players will see for all triggered abilities come in the form of buttons with the name of the card. In certain scenarios, you may want to override that title. This can be done by passing a `title` method which will take the ability `context` object (allowing access to the event and its parameters) and which should return the string to be added after the card name in ability prompts.

```javascript
this.interrupt({
    // ...
    title: context => 'Do something',
    // Results in a prompt button: Iron Mines - Do something
});
```

#### Limiting the number of uses

Some abilities have text limiting the number of times they may be used in a given period. You can pass an optional `limit` property using one of the duration-specific ability limiters.

```javascript
this.reaction({
    when: {
        // the attached character gains power
    },
    // limit once per phase
    limit: ability.limit.perPhase(1),
    handler: () => {
        // stand the attached character
    }
});
```

#### Abilities outside of play

Certain abilities, such as those for The Prince's Plan, can only be activated in non-play locations. Such reactions should be defined by specifying the `location` property with the location from which the ability may be activated. The player can then activate the ability when prompted.

```javascript
this.reaction({
    location: 'discard pile',
    // Implementation for The Prince's Plan
})
```

#### When revealed abilities

When implementing plot cards that have a **When Revealed** ability, use the `whenRevealed` method. It will automatically listen to the correct event for you and all that must be provided is a `handler` method.

```javascript
this.whenRevealed({
    handler: () => {
        // code to implement the ability
    }
});
```

### Ability limits

Actions, reactions, and interrupts can have limits on how many times they may be used within a certain period. These limits can be set by setting the `limit` property on the ability. The `ability` object has a limit helper with methods for the different periods.

To limit an ability per challenge, use `ability.limit.perChallenge(x)`.

To limit an ability per phase, use `ability.limit.perPhase(x)`.

To limit an ability per challenge, use `ability.limit.perRound(x)`.

In each case, `x` should be the number of times the ability is allowed to be used.

### Language

#### Game messages should begin with the player doing the action

Game messages should begin with the name of the player to ensure a uniform format and make it easy to see who triggered an ability.

* **Bad**: Tyrion Lannister triggers to gain 2 gold for Player1
* **Good**: Player1 uses Tyrion Lannister to gain 2 gold

#### Game messages should not end in punctuation

No game messages should end in a period, exclaimation point or question mark.

* **Bad**: Player1 draws 2 cards.
* **Good**: Player1 draws 2 cards

#### Game messages should use present tense.

All game messages should use present tense.

* **Bad**: Player1 has used Ser Gregor Clegane to kill The Red Viper
* **Bad**: Player1 killed The Red Viper
* **Good**: Player1 uses Ser Gregor Clegane to kill The Red Viper
* **Good**: Player1 kills The Red Viper

#### Targeting prompts should use the format "Select a \<card type\>" where possible.

Targeting prompts should ask the player to select a card or a card of particular type to keep prompt titles relatively short, without specifying the final goal of card selection.

* **Bad**: Select a character to return to hand
* **Good**: Select a character

**Exception:** If a card requires the player to select multiple cards, such as Renly's Pavillion, you can add context about which one they should be selecting. Just keep it as short as reasonably possible.

As valid selections are already presented to the user via visual clues, targeting prompts should not repeat selection rules in excessive details. Specifying nothing more and nothing less than the eligible card type (if any) is the good middle ground.

* **Bad**: Select a Knight
* **Good**: Select a character

* **Bad**: Select a defending Night's Watch character
* **Good**: Select a character

* **Bad**: Select a card from your discard pile
* **Good**: Select a card

* **Good**: Select an attachment or location
