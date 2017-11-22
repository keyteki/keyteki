
## Implementing Cards

### Getting started

To implement a card, follow these steps:

##### 1. Create a file named after the card.

Cards are organized under the `/server/game/cards` directory by grouping them by cycle/set number, pack number if applicable, and name.

```
/server/game/cards/01-Core/CloudTheMind.js //Core Set
/server/game/cards/02.1-ToA/GoblinSneak.js //Imperial Cycle, Pack 1, Tears of Amaterasu
```

#### 2. Create a class for the card and export it.

Character, holding, event and attachment cards should be derived from the `DrawCard` class.

Province cards should be derived from the `ProvinceCard` class.

Stronghold cards should be derived from the `StrongholdCard` class.

The card class should have its `id` property set to the unique card identifier for that card. You can find these at https://api.fiveringsdb.com/cards

```javascript
const DrawCard = require('../../drawcard.js');

class CloudTheMind extends DrawCard {
    // Card definition
}

CloudTheMind.id = 'cloud-the-mind';

module.exports = CloudTheMind;
```

#### 3. Override the `setupCardAbilities` method.

Persistent effects, actions, and triggered abilities should be defined in the `setupCardAbilities` method. This method passes in an `ability` parameter that gives you access to effect implementations and ability limits. See below for more documentation.

```javascript
class CloudTheMind extends DrawCard {
    setupCardAbilities(ability) {
        // Declare persistent effects, reactions and interrupts here.
    }
}
```

### Keywords

Keywords are automatically parsed from the card text. It isn't necessary to explicitly implement them unless they are provided by a conditional persistent effect.

### Static bonuses from attachments

Static attachment bonuses are automatically included in skill calculation.  They don't need to be implemented unless they are dynamic (e.g. Born in War)

### Persistent effects

Many cards provide continuous bonuses to other cards you control or detrimental effects to opponents cards in certain situations. These can be defined using the `persistentEffect` method. Cards that enter play while the persistent effect is in play will automatically have the effect applied, and cards that leave play will have the effect removed. If the card providing the effect becomes blank, the effect is automatically removed from all previously applied cards.

For a full list of properties that can be set when declaring an effect, look at `/server/game/effect.js`. Here are some common scenarios:

#### Matching conditions vs matching specific cards

The effect declaration takes a `match` property. In most cases this will be a function that takes a `Card` object and should return `true` if the effect should be applied to that card.

```javascript
// Each honored Crane character you control gains Sincerity.
this.persistentEffect({
    match: card => card.getType() === 'character' && card.isHonored && card.isFaction('crane'),
    effect: ability.effects.addKeyword('sincerity')
});
```

In some cases, an effect should be applied to a specific card. While you could write a `match` function to match only that card, you can provide the `Card` object as a shorthand.

```javascript
// This character gets +3P while defending.
this.persistentEffect({
    condition: () => this.game.currentConflict && this.game.currentConflict.isDefending(this),
    match: this,
    effect: ability.effects.modifyPoliticalSkill(3)
});
```

#### Conditional effects

Some effects have a 'when', 'while' or 'if' clause within their text. These cards can be implemented by passing a `condition` function into the persistent effect declaration. The effect will only be applied when the function returns `true`. If the function returns `false` later on, the effect will be automatically unapplied from the cards it matched.

```javascript
// During a conflict in which this character is participating, each other participating Lion character you control gets +1M.
this.persistentEffect({
    condition: () => this.game.currentConflict && this.game.currentConflict.isParticipating(this),
    match: card => card.getType() === 'character' && this.game.currentConflict.isParticipating(card) && card.isFaction('lion') && card !== this,
    effect: ability.effects.modifyMilitarySkill(1)
});
```

#### Targeting opponent or all matching cards

By default, an effect will only be applied to cards controlled by the current player. The `targetController` property can be modified to specify which players' cards should be targeted.

To target only opponent cards, set `targetController` to `'opponent'`:

```javascript
// While  attacking, each defending character gets -1M.
this.persistentEffect({
    condition: () => this.game.currentConflict && this.game.currentConflict.isAttacking(this),
    match: card => this.game.currentConflict && this.game.currentConflict.isDefending(card),
    targetController: 'opponent',
    effect: ability.effects.modifyMilitarySkill(-1)
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

#### Dynamic skill

A few cards provide skill bonuses based on game state. For example, [Ishiken Initiate](https://fiveringsdb.com/card/ishiken-initiate) gets a bonus to political and military skill depending on how many rings have been claimed. `dynamicMilitarySkill` and `dynamicPoliticalSkill` effects take a function to determine what the skill bonus is currently.

```javascript
// This character gets +1M and +1P for each claimed ring.
this.persistentEffect({
    match: this,
	effect: [
		ability.effects.dynamicMilitarySkill(this.getNoOfClaimedRings()),
		ability.effects.dynamicPoliticalSkill(this.getNoOfClaimedRings())
	]
	})
});
```

Certain cards may apply effects that need to be recalculated mid-conflict. For example, [Utaku Infantry](https://fiveringsdb.com/card/utaku-infantry) gets a bonus to political and military skill depending on how many unicorn characters you have in the conflict. For such scenarios, pass the optional `recalculateWhen` property as an array of event names for which the effect should be recalculated. **Note:** this mechanism should be used sparingly if possible and only with problematic cards.

```javascript
// Utaku Infantry gets +1M and +1P for each participating unicorn character you control.
this.persistentEffect({
	condition: () => this.game.currentConflict && this.game.currentConflict.isParticipating(this),
	match: this,
	recalculateWhen: ['onMove', 'onPlayIntoConflict'],
	effect: [
		ability.effects.dynamicMilitarySkill(() => this.getNoOfUnicornCharacters()),
		ability.effects.dynamicPoliticalSkill(() => this.getNoOfUnicornCharacters())
	]
});
```

#### Attachment-based effects

A `whileAttached` method is provided to define persistent effects that are applied to the card an attachment is attached. These effects remain as long as the card is attached to its parent and the attachment has not been blanked.

```javascript
// Attached character gains Pride.
this.whileAttached({
    effect: ability.effects.addKeyword('pride')
});
```

If the effect has an additional requirement, an optional `match` function can be passed in.
```javascript
// If attached character is unicorn, they gain +1M.
this.whileAttached({
    match: card => card.isFaction('unicorn'),
    effect: ability.effects.modifyMilitarySkill(1)
});
```

#### Applying multiple effects at once
As a shorthand, it is possible to pass an array into the `effect` property to apply multiple effects that have the same conditions / matching functions.

```javascript
// This character gets +1M and +1P while you are less honorable than an opponent..
this.persistentEffect({
    condition: () => this.isLessHonorableThanOpponent(),
    match: this,
    effect: [
        ability.effects.modifyMilitarySkill(1),
        ability.effects.modifyPoliticalSkill(1)
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
// You may initiate an additional military conflict during the conflict phase.
this.persistentEffect({
    targetType: 'player',
    targetController: 'current',
    effect: ability.effects.modifyConflictTypeLimit('military', 1)
});
```

### Lasting effects

Unlike persistent effects, lasting effects are typically applied during an action, reaction or interrupt and expire after a specified period of time.  Because lasting effects can be applied almost anywhere, each method takes a factory function that provides the `ability` object and should return the effect properties. The properties returned when applying these effects are identical to those of persistent effects, but additional methods are provided to apply them immediately with the correct duration.

**Important: These should not be used within setupCardAbilities, only within handler code for actions and triggered abilities.**

To apply an effect to last until the end of the current conflict, use `untilEndOfConflict`:
```javascript
// Until the end of the conflict, this character gains +2M and +2P
this.untilEndOfConflict(ability => ({
	match: this,
	effect: [
		ability.effects.modifyMilitarySkill(2),
		ability.effects.modifyPoliticalSkill(2)
	]
}));
```

To apply an effect that will expire 'at the end of the conflict', use `atEndOfConflict`:
```javascript
// If that character is still in play at the end of the conflict, return it to the bottom of its deck.
this.atEndOfConflict(ability => ({
    match: card,
    effect: ability.effects.returnToBottomOfDeckIfStillInPlay())
}));
```

To apply an effect to last until the end of the current phase, use `untilEndOfPhase`:
```javascript
// Until the end of the phase, this character gains +2 glory.
this.untilEndOfPhase(ability => ({
	match: context.target,
	effect: ability.effect.modifyGlory(2)
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
class BorderRider extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready this character',
            handler: () => {
                // code to ready character
            }
        });
    }
}
```

player executing the action is passed into the method.

#### Checking ability restrictions

Card abilities can only be triggered if they have the potential to modify game state (outside of paying costs). To ensure that the action's play restrictions are met, pass a `condition` function that returns `true` when the restrictions are met, and `false` otherwise. If the condition returns `false`, the action will not be executed and costs will not be paid.

```javascript
this.action({
    title: 'Ready this character',
    // Ensure that the character is currently bowed
    condition: () => this.bowed,
    // ...
});
```

#### Paying additional costs for action

Some actions have an additional cost, such as kneeling the card. In these cases, specify the `cost` parameter. The action will check if the cost can be paid. If it can't, the action will not execute. If it can, costs will be paid automatically and then the action will execute.

For a full list of costs, look at `/server/game/costs.js`.

```javascript
this.action({
    title: 'Bow this character',
    // This card must be bowed as a cost for the action.
    cost: ability.costs.bowSelf(),
    // ...
});
```

If a card has multiple costs, an array of cost objects may be sent using the `cost` property.

```javascript
this.action({
    title: 'Reduce the next character bought by 3',
    // This card must be bowed AND sacrificed as a cost for the action.
    cost: [
        ability.costs.bowSelf(),
        ability.costs.sacrificeSelf()
    ],
    // ...
});
```

#### Choosing / targeting cards

Cards that specify to 'choose' or otherwise target a specific card can be implemented by passing a `target` property, At minimum, the target property must have an `activePromptTitle` to be used as the prompt text, and a `cardCondition` function that returns `true` for valid targets. Any other properties that apply to `Game.promptForSelect` are valid.

```javascript
this.action({
	title: 'Sacrifice to discard an attachment'
	target: {
		activePromptTitle: 'Choose an attachment',
		cardType: 'attachment',
		cardCondition: card => card.location === 'play area'
	},
    // ...
});
```

The card that was chosen will be set on the `target` property of the context object passed to the handler.

```javascript
this.action({
    // ...
	handler: context => {
		this.game.addMessage({0} sacrifices {1} to discard {2}, this.controller, this, context.target);
		this.controller.removeAttachment(context.target);
	}
});
```

Some card abilities require multiple targets. These may be specified using the `targets` property. Each sub key under `targets` is the name that will be given to the chosen card, and the value is the prompt properties.

```javascript
this.action({
    title: 'Bow this card to modify the skill of two characters',
    targets: {
        toLower: {
            activePromptTitle: 'Choose a character to get -1 skill',
            cardCondition: card => this.cardCondition(card)
        },
        toRaise: {
            activePromptTitle: 'Choose a character to get +1 skill',
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

If an action is cancelled in this manner, it is not counted towards any 'limit X per conflict/phase/round' requirements.

#### Limiting an action to a specific phase

Some actions are limited to a specific phase by their card text. You can pass an optional `phase` property to the action to limit it to just that phase. Valid phases include `'dynasty'`, `'draw'`, `'conflict'`, `'fate'`, `'regroup'`. The default is `'any'` which allows the action to be triggered in any phase.

```javascript
this.action({
	title: 'Sacrifice to discard an attachment',
	phase: 'conflict',
    // ...
});
```

#### Limiting the number of uses

Some actions have text limiting the number of times they may be used in a given period. You can pass an optional `limit` property using one of the duration-specific ability limiters.

```javascript
this.action({
    title: 'Remove 1 fate',
    limit: ability.limit.perConflict(2),
    // ...
});
```

#### Actions outside of play

Certain actions, such as that of Ancestral Guidance, can only be activated while the character is in the discard pile. Such actions should be defined by specifying the `location` property with the location from which the ability may be activated. The player can then activate the ability by simply clicking the card. If there is a conflict (e.g. both the ability and playing the card normally can occur), then the player will be prompted.

```javascript
this.action({
    title: 'Play from discard pile',
    location: 'conflict discard pile',
    // ...
})
```

### Triggered abilities

Triggered abilities include all card abilities that have **Interrupt**, **Forced Interrupt**, **Reaction**, **Forced Reaction**, or **When Revealed**. For full documentation of properties, see `/server/game/promptedtriggeredability.js` and `/server/game/forcedtriggeredability.js`. Here are some common scenarios:

#### Defining the triggering condition

Each triggered ability has an associated triggering condition. This is done using the `when` property. This should be an object whose sub-property is the name of the event, and whose value is a function with the parameters of that event. When the function returns `true`, the ability will be executed.

```javascript
this.reaction({
	// When this card enters play, honor it
	when: {
		onCardEntersPlay: (event, params) => params.card === this
	},
	handler: () => this.controller.honorCard(this)
});
```

In rare cases, there may be multiple triggering conditions for the same ability. For example, [Young Rumormonger](https://fiveringsdb.com/card/young-rumormonger) can change the target when a player honors OR dishonors a character. In these cases, just define an additional event on the `when` object.

```javascript
this.interrupt({
    when: {
        onCardHonored: event => !event.card.isHonored,
        onCardDishonored: event => event.card.allowGameAction('dishonor')
    },
    canCancel: true,
    target: {
        // Select new target
    },
    handler: context => {
        // Honor or dishonor new target
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
// After the fate phase begins, if you have at least 5 more honor than an opponent – this character cannot be discarded or lose fate this phase.
this.forcedInterrupt({
	when: {
		onPhaseStarted: (event, context) => context.phase === 'fate'
	},
	handler: () => {
		this.untilEndOfPhase(ability => ({
			match: this,
			effect: [
				ability.effect.cannotLoseFate,
				ability.effect.cannotBeDiscarded
			]
		}));
	}
});
```

#### Cancelling or replacing events with interrupts

Some cards (primarily saving cards) allow the player to cancel an effect. The `handler` method is always passed a `context` object that allows the handler to cancel the event. Such abilities must also be passed `canCancel: true` in the declaration.

```javascript
this.interrupt({
    when: {
        // attached character would leave play
    },
    canCancel: true,
    handler: (context) => {
        context.cancel();
        // discard this attachment
    }
});
```

In other cases, abilities contain the word 'instead' to indicate that the event will not be cancelled, but the normal effect will be replaced. In these case, `context.skipHandler()` can be called to replace the effect.

```javascript
this.interrupt({
    when: {
        // character is honored or dishonored
    },
    handler: context => {
        context.skipHandler();
        // prompt the player to choose a character to honor or dishonor
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

#### Paying additional costs for reactions and interrupts

Some abilities have an additional cost, such as kneeling the card. In these cases, specify the `cost` parameter. The ability will check if the cost can be paid. If it can't, the ability will not prompt the player. If it can, costs will be paid automatically and then the ability will execute.

For a full list of costs, look at `/server/game/costs.js`.

```javascript
this.interrupt({
    when: {
        // Event is initiated
    }
    // Dishonor a courtier as a cost
    cost: ability.costs.dishonorCharacter(card => card.hasTrait('courtier')),
	canCancel: true,
    handler: context => context.cancel()
});
```

If a card has multiple costs, an array of cost objects may be sent using the `cost` property.

```javascript
this.reaction({
    when: {
        // ...
    },
    // This card must be bowed AND sacrificed as a cost for the action.
    cost: [
        ability.costs.bowSelf(),
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
    // Results in a prompt button: Shameful Display - Do something
});
```

#### Limiting the number of uses

Some abilities have text limiting the number of times they may be used in a given period. You can pass an optional `limit` property using one of the duration-specific ability limiters.

```javascript
this.action({
	title: 'Remove 1 fate',
	phase: 'conflict',
	condition: this.game.currentConflict,
	cost: ability.costs.discardFate(1),
	limit: ability.limit.perConflict(2),
	handler: () => {
        // give the character +2M, +2P
    }
});
```

#### Abilities outside of play

Certain abilities, such as that of Vengeful Oathkeeper can only be activated in non-play locations. Such reactions should be defined by specifying the `location` property with the location from which the ability may be activated. The player can then activate the ability when prompted.

```javascript
this.reaction({
	when: {
		afterConflict: (event, context) => context.conflict.loser === this.controller && context.conflict.conflictType === 'military'
	},
	location: 'hand',
	handler: () => this.controller.putIntoPlay(this)
})
```

### Ability limits

Actions, reactions, and interrupts can have limits on how many times they may be used within a certain period. These limits can be set by setting the `limit` property on the ability. The `ability` object has a limit helper with methods for the different periods.

To limit an ability per conflict, use `ability.limit.perConflict(x)`.

To limit an ability per phase, use `ability.limit.perPhase(x)`.

To limit an ability per round, use `ability.limit.perRound(x)`.

In each case, `x` should be the number of times the ability is allowed to be used.

### Language

#### Game messages should begin with the player doing the action

Game messages should begin with the name of the player to ensure a uniform format and make it easy to see who triggered an ability.

* **Bad**: Kaiu Shuichi triggers to gain 1 fate for Player1
* **Good**: Player1 uses Kaiu Shuichi to gain 1 fate

#### Game messages should not end in punctuation

No game messages should end in a period, exclaimation point or question mark.

* **Bad**: Player1 draws 2 cards.
* **Good**: Player1 draws 2 cards

#### Game messages should use present tense.

All game messages should use present tense.

* **Bad**: Player1 has used Isawa Masahiro to discard Miya Mystic
* **Bad**: Player1 killed Miya Mystic
* **Good**: Player1 uses Isawa Masahiro to discard Miya Mystic
* **Good**: Player1 kills Miya Mystic

#### Targeting prompts should use the format "Choose a \<card type\>" where possible.

Targeting prompts should ask the player to choose a card or a card of particular type to keep prompt titles relatively short, without specifying the final goal of card selection.

* **Bad**: Choose a character to return to hand
* **Good**: Choose a character

**Exception:** If a card requires the player to choose multiple cards, such as Shameful Display, you can add context about which one they should be selecting. Just keep it as short as reasonably possible.

As valid selections are already presented to the user via visual clues, targeting prompts should not repeat selection rules in excessive details. Specifying nothing more and nothing less than the eligible card type (if any) is the good middle ground.

* **Bad**: Choose a Bushi
* **Good**: Choose a character

* **Bad**: Choose a defending Crab character
* **Good**: Choose a character

* **Bad**: Choose a card from your discard pile
* **Good**: Choose a card

* **Good**: Choose an attachment or location
