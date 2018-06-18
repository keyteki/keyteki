
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

For a full list of properties that can be set when declaring an effect, look at `/server/game/Effects/effect.js`. To see all the types of effect which you can use (and whether they apply to cards, rings or players), look at `/server/game/effects.js`. Here are some common scenarios:

#### Matching conditions vs matching specific cards

The effect declaration (for card and ring effects) takes a `match` property. In most cases this will be a function that takes a `Card` (or `Ring`) object and should return `true` if the effect should be applied to that card.

```javascript
// Each honored Crane character you control gains Sincerity.
this.persistentEffect({
    match: card => card.getType() === 'character' && card.isHonored && card.isFaction('crane'),
    effect: ability.effects.addKeyword('sincerity')
});
```

In some cases, an effect should be applied to a specific card. While you could write a `match` function to match only that card, you can provide the `Card` (or `Ring`) object as a shorthand.

```javascript
// This character gets +3P while defending.
this.persistentEffect({
    condition: () => this.isDefending(),
    match: this,
    effect: ability.effects.modifyPoliticalSkill(3)
});
```

#### Conditional effects

Some effects have a 'when', 'while' or 'if' clause within their text. These cards can be implemented by passing a `condition` function into the persistent effect declaration. The effect will only be applied when the function returns `true`. If the function returns `false` later on, the effect will be automatically unapplied from the cards it matched.

```javascript
// During a conflict in which this character is participating, each other participating Lion 
// character you control gets +1M.
this.persistentEffect({
    condition: () => this.isParticipating(),
    match: card => card.getType() === 'character' && card.isParticipating() && 
                   card.isFaction('lion') && card !== this,
    effect: ability.effects.modifyMilitarySkill(1)
});
```

#### Targeting opponent or all matching cards

By default, an effect will only be applied to cards controlled by the current player. The `targetController` property can be modified to specify which players' cards should be targeted.

To target only opponent cards, set `targetController` to `'opponent'`:

```javascript
// While  attacking, each defending character gets -1M.
this.persistentEffect({
    condition: () => this.isAttacking(),
    match: card => card.isDefending(),
    targetController: 'opponent',
    effect: ability.effects.modifyMilitarySkill(-1)
});
```

To target all cards regardless of who controls them, set `targetController` to `'any'`:

```javascript
// While this character is participating in a conflict, characters cannot become dishonored.
this.persistentEffect({
    condition: () => this.isParticipating(),
    targetController: 'any',
    match: card => card.getType() === 'character' && card.location === 'play area',
    effect: ability.effects.cardCannot('becomeDishonored')
});
```

#### Dynamic skill

A few cards provide skill bonuses based on game state. For example, [Beastmaster Matriarch](https://fiveringsdb.com/card/beastmaster-matriarch) gets a bonus to military skill depending on how many rings have been claimed. Where the bonus should be continously updated, pass a function as the effect paramater. In `/server/game/effects.js`, you can see whether an effect is coded as static (expects to be passed an integer), dynamic (expects to be passed a function) or flexible (can take either).

```javascript
// This character has +2[military] for each ring in each opponent's claimed ring pool.
this.persistentEffect({
    match: this,
    effect: ability.effects.modifyMilitarySkill(() => this.getTwiceOpponentsClaimedRings())
}
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

#### Applying effects to cards which aren't in play

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

This also applies to provinces, holdings and strongholds, which the game considers to be 'in play' even though they aren't in the play area.  Where an effect needs to be applied to these cards (or to characters who are in a province), set `targetLocation` to `'province'`.

```javascript
// This province gets +5 strength during [political] conflicts.
this.persistentEffect({
    match: this,
    targetLocation: 'province',
    condition: () => this.game.isDuringConflict('political'),
    effect: ability.effects.modifyProvinceStrength(5)
});
```

#### Player modifying effects

Certain cards provide bonuses or restrictions on the player itself instead of on any specific cards. These effects are marked as `player` effects in `/server/game/effects.js`. For player effects, `targetController` indicates which players the effect should be applied to (with `'current'` acting as the default). Player effects should not have a `match` property.

```javascript
// While this character is participating in a conflict, opponents cannot play events.
this.persistentEffect({
    condition: () => this.isParticipating(),
    targetController: 'opponent',
    effect: ability.effects.playerCannot(context => context.source.type === 'event')
});
```

### Actions

Actions are abilities provided by the card text that players may trigger during action windows. They are declared using the `action` method. See `/server/game/cardaction.js` for full documentation. Here are some common scenarios:

#### Declaring an action

When declaring an action, use the `action` method and provide it with a `title` property. The title is what will be displayed in the menu players see when clicking on the card. 

```javascript
class BorderRider extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ready this character',
            gameAction: ability.actions.ready()
        });
    }
}
```

#### Context object

When the game starts to resolve an ability, it creates a context object for that ability. Generally, the context ability has the following structure:

```javascript
class AbilityContext {
    constructor(properties) {
        this.game = properties.game;
        this.source = properties.source;
        this.player = properties.player;
        this.ability = properties.ability;
        this.costs = {};
        this.targets = {};
        this.rings = {};
        this.selects = {};
        this.stage = 'effect';
    }
}
```

`context.source` is the card with the ability being used, and `context.player` is the player who is using the ability (almost always the controller of the `context.source`). When implementing actions and other triggered abilities, `context` should almost always be used (instead of `this`) to reference cards or players.  The only exception is that `this.game` can be used as an alternative to `context.game`.

#### Checking ability restrictions

Card abilities can only be triggered if they have the potential to modify game state (outside of paying costs). To ensure that the action's play restrictions are met, pass a `condition` function that returns `true` when the restrictions are met, and `false` otherwise. If the condition returns `false`, the action will not be executed and costs will not be paid.

```javascript
// During a conflict, give this character +2/+2
this.action({
    title: 'Give this character +2/+2',
    condition: () => this.game.isDuringConflict(),
    // ...
});
```

```javascript
// While this character is participating in a conflict....
this.action({
    title: 'Switch a character\'s M and P skill',
    condition: context => context.source.isParticipating(),
    // ...
});
```

#### Paying additional costs for action

Some actions have an additional cost, such as bowing the card. In these cases, specify the `cost` parameter. The action will check if the cost can be paid. If it can't, the action will not execute. If it can, costs will be paid automatically and then the action will execute.

For a full list of costs, look at `/server/game/costs.js`.

```javascript
// During a conflict, bow this character. Choose another [crane] character - that character gets +0/+3 until the end of the conflict
this.action({
    title: 'Give a character +0/+3',
    // This card must be bowed as a cost for the action.
    cost: ability.costs.bowSelf(),
    // ...
});
```

If a card has multiple costs, an array of cost objects may be sent using the `cost` property.

```javascript
this.action({
    title: 'Give all non-unique participating characters -2/-0',
    // This card must be bowed AND sacrificed as a cost for the action.
    cost: [
        ability.costs.bowSelf(),
        ability.costs.sacrificeSelf()
    ],
    // ...
});
```

#### Choosing / targeting cards

Cards that specify to 'choose' or otherwise target a specific card should be implemented by passing a `target` property. The target property should include any limitations set by the ability, using the `cardType`, `location`, `controller` and/or `cardCondition` property. A game action can also be included by using the `gameAction` property, which will restrict the card chosen to those for which that game action is legal (e.g. only cards in the play area can be dishonored, only cards with fate can have fate removed from them, etc.).  If an array of game actions is specified, then the target only needs to meet the requirements of one of them.

Generally, it's a good idea to pass at least a `cardType` property, as that will automatically change the prompt to make it easier for the player to understand what is going on. Most other properties that apply to `Game.promptForSelect` are also valid here.

```javascript
this.action({
    title: 'Grant Covert to a character',
    target: {
        cardType: 'character',
        location: 'play area'
    },
    // ...
});
```

```javascript
this.action({
    title: 'Sacrifice to discard an attachment'
    target: {
        cardType: 'attachment',
        gameAction: ability.actions.discardFromPlay()
    },
    // ...
});
```
#### Multiple targets

Some card abilities require multiple targets. These may be specified using the `targets` property. Each sub key under `targets` is the name that will be given to the chosen card, and the value is the prompt properties.

```javascript
// Action: While this character is participating in a conflict, choose a ready non-participating character with printed 
// cost 2 or lower controller by each player – move each chosen character to the conflict
this.action({
    title: 'Move characters into conflict',
    condition: context => context.source.isParticipating(),
    targets: {
        myChar: {
            cardType: 'character',
            controller: 'self',
            cardCondition: card => !card.bowed && card.getCost() <= 2,
            gameAction: ability.actions.moveToConflict()
        },
        oppChar: {
            cardType: 'character',
            controller: 'opponent',
            cardCondition: card => !card.bowed && card.getCost() <= 2,
            gameAction: ability.actions.moveToConflict()                    
        }
    }
});
```

Once all targets are chosen, they will be set using their specified name under the `targets` property on the handler context object.

#### Targeting rings

Rings are targeted in almost the same way as cards.  For abilities which target rings, set the `mode` property to `'ring'`, and use `ringCondition` instead of `cardCondition`. Most of the ring selection prompt properties are valid here also, see `/server/game/gamesteps/selectringprompt.js` for more details. the chosen ring is stored in `context.ring` (or `context.rings[targetName]` where an ability has multiple targets).

```javascript
// Action: Choose a ring and an opponent – that player cannot declare conflicts 
// of that ring's element this phase. (Max 1 per phase.)
this.action({
    title: 'Prevent an opponent contesting a ring',
    condition: context => context.player.opponent,
    target: {
        mode: 'ring',
        ringCondition: () => true
    },
    // ...
});
```

#### Select options

Some abilities require the player (or their opponent) to choose between multiple options.  This is done in the same way as targets above, but by using the `mode` property set to `'select'`.  In addition, a `choices` object should be included, which contains key:value pairs where the key is the option to display to the player, and the value is either a function which takes the `context` object and returns a boolean indicating whether this option is legal, or a game action which will be evaluated on the basis of the specified target (or default as detailed below) to determine whether the choice is legal.  The selected option is stored in `context.select.choice` (or `context.selects[targetName].choice` for an ability with multiple targets).

```javascript
// Action: During a conflict at this province, select one – switch the contested ring with an unclaimed 
// ring, or switch the conflict type.
this.action({
    title: 'Switch the conflict type or ring',
    condition: context => context.source.isConflictProvince(),
    target: {
        player: 'self',
        mode: 'select',
        choices: {
            'Switch the contested ring': () => _.any(this.game.rings, ring => ring.isUnclaimed()),
            'Switch the conflict type': () => true
        }
    },
    // ...
});
```

```javascript
// Action: If an opponent has declared 2 or more conflicts against you this phase, select one – 
// take 1 fate or 1 honor from that opponent.
this.action({
    title: 'Take 1 fate or 1 honor',
    phase: 'conflict',
    condition: context => this.game.completedConflicts.filter(
        conflict => conflict.attackingPlayer === context.player.opponent
    ).length > 1,
    target: {
        player: 'self',
        mode: 'select',
        choices: {
            'Take 1 fate': ability.actions.takeFate(),
            'Take 1 honor': ability.actions.takeHonor()
        }
    }
});
```

### Ability effects

In general, the effects of an ability should be implemented using Game Actions.

#### Game Actions

Actions (and other triggered abilities) often use game actions.  Available game actions can be found in `/server/game/GameActions/GameActions.js`, along with any parameters and their defaults.  Game actions as properties in the main ability section default to targetomg the card generating the ability (for cards), the opponent (for players) and the contested ring (for rings). Game actions included in `target` (or in one of `targets`) will default to the that target. You can change the target of a game action or the parameters by passing either an object with the properties you want, or a function which takes `context` and returns those properties.

```javascript
// Action: During a conflict, bow this attachment – move attached character to the conflict.
this.action({
    title: 'Move this character into the conflict',
    cost: ability.costs.bowSelf(),
    gameAction: ability.actions.moveToConflict(context => ({ target: context.source.parent }))
});
```

```javascript
// Reaction: After this character enters play – place 1 fate from an opponent's fate pool on it.
this.reaction({
    title: 'Steal a fate',
    // reaction condition code
    gameAction: ability.actions.placeFate(context => ({ origin: context.player.opponent }))
});
```

#### Effect messages

Once costs have been paid and targets chosen (but before the ability resolves), the game automatically displays a message in the chat box which tells both players the ability, costs and targets of the effect.  Game actions will automatically generate their own effect message, although this will only work for a single game action.  If the effects of the ability involve two or more game actions, or the effect is a lasting effect or uses a handler, then an `effect` property is required.  The effect property will be passed the target (card(s) or ring) of the effect (or the source if there are no targets) as its first parameter (and so can be referenced using `'{0}'` in the effect property string).  If other references are required, this can be done using curly bracket references in the effect string(`'{1}', '{2', etc`) and supplying an `effectArgs` property (which generally will be a function taking the `context` object):

```javascript
this.action({
    // Action: Return this attachment to your hand and dishonor attached character.
    title: 'Return court mask to hand',
    effect: 'return {0} to hand, dishonoring {1}',
    effectArgs: context => context.source.parent,
    gameAction: [ability.actions.returnToHand(), ability.actions.dishonor(context => ({ target: context.source.parent }))]
});
```

```javascript
this.action({
    // Action: While this character is participating in a conflict, choose another participating character – until the end of the conflict, that character gets +2/+2 for each holding you control.
    title: 'Give a character a bonus for each holding',
    condition: context => context.source.isParticipating(),
    target: {
        cardType: 'character',
        cardCondition: (card, context) => card.isParticipating() && card !== context.source,
        gameAction: ability.actions.cardLastingEffect(context => ({
            effect: ability.effects.modifyBothSkills(2 * context.player.getNumberOfHoldingsInPlay())
        }))
    },
    effect: 'give {0} +{1}{2}/+{1}{3}',
    effectArgs: context => [2 * context.player.getNumberOfHoldingsInPlay(), 'military', 'political']
});
```

#### Lasting effects

Unlike persistent effects, lasting effects are typically applied during an action, reaction or interrupt and expire after a specified period of time.  Lasting effect use the same properties as persistent effects, above.  Lasting effects are applied using the `cardLastingEffect`, `ringLastingEffect` or `playerLastingEffect`, depending on what they affect.  They take a `duration:` property which is one of `untilEndOfConflict` (default), `untilEndOfPhase` or `untilEndOfRound`.

```javascript
// Action: During a conflict, bow this character. Choose another [crane] character – that character 
// gets +3 [political] until the end of the conflict.
this.action({
    title: 'Give a character +0/+3',
    condition: () => this.game.isDuringConflict(),
    cost: ability.costs.bowSelf(),
    target: {
        cardType: 'character',
        cardCondition: (card, context) => card !== context.source && card.isFaction('crane'),
        gameAction: ability.actions.cardLastingEffect(() => ({
            duration: 'untilEndOfConflict',
            effect: ability.effects.modifyPoliticalSkill(3)
        }))
    },
    effect: 'give {0} +3{1} skill',
    effectArgs: () => 'political'
});

```

To apply an effect to last until the end of the current phase, use `untilEndOfPhase`:
```javascript
// Action: Reduce the cost of the next event you play this phase by 1.
this.action({
    title: 'Reduce cost of next event by 1',
    effect: 'reduce the cost of their next event by 1',
    gameAction: ability.actions.playerLastingEffect({
        duration: 'untilEndOfPhase',
        effect: ability.effects.reduceNextPlayedCardCost(1, card => card.type === 'event')
    })
});
```

To apply an effect to last until the end of the round, use `untilEndOfRound`:
```javascript
/// Action: Choose a holding you control – you may trigger each of that holding's triggered abilities an additional time this round (or specified period).
this.action({
    title: 'Add an additional ability use to a holding',
    target: {
        cardType: 'holding',
        location: 'province',
        controller: 'self',
        gameAction: ability.actions.cardLastingEffect({
            duration: 'untilEndOfPhase',
            targetLocation: 'province',
            effect: ability.effects.increaseLimitOnAbilities(1)
        })
    },
    effect: 'add an additional use to each of {0}\'s abilities'
});
```

#### Limiting an action to a specific phase

Some actions are limited to a specific phase by their card text. You can pass an optional `phase` property to the action to limit it to just that phase. Valid phases include `'dynasty'`, `'draw'`, `'conflict'`, `'fate'`, `'regroup'`. The default is `'any'` which allows the action to be triggered in any phase.

```javascript
this.action({
    title: 'Sacrifice to discard an attachment',
    cost: ability.costs.sacrificeSelf(),
    phase: 'conflict',
    target: {
        cardType: 'attachment',
        gameAction: ability.actions.discardFromPlay()
    }
});
```

#### Limiting the number of uses

Some actions have text limiting the number of times they may be used in a given period. You can pass an optional `limit` property using one of the duration-specific ability limiters. See `/server/game/abilitylimit.js` for more details.

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

Triggered abilities include all card abilities that have **Interrupt**, **Forced Interrupt**, **Reaction**, **Forced Reaction**. Implementing a triggered ability is similar to actions above, but instead of calling `this.action`, `this.reaction` or `this.interrupt` are used instead. Costs and targets are declared in the same way. For full documentation of properties, see `/server/game/triggeredability.js`. Here are some common scenarios:

#### Defining the triggering condition

Each triggered ability has an associated triggering condition. This is done using the `when` property. This should be an object whose sub-property is the name of the event, and whose value is a function which takes the event and the context object. When the function returns `true`, the ability will be executed.

```javascript
this.reaction({
    // When this card enters play, honor it
    when: {
    	onCharacterEntersPlay: (event, context) => event.card === context.source
    },
    gameAction: ability.actions.honor()
});
```

In rare cases, there may be multiple triggering conditions for the same ability. For example, [Ikoma Prodigy](https://fiveringsdb.com/card/ikoma-prodigy) gains an honor when fate is placed on her while playing her, or while she is in play. In these cases, just define an additional event on the `when` object.

```javascript
this.reaction({
    title: 'Gain 1 honor',
    when: {
        onCharacterEntersPlay: (event, context) => event.card === context.source && context.source.fate > 0,
        onMoveFate: (event, context) => event.recipient === context.source && event.fate > 0
    },
    gameAction: ability.actions.gainHonor()
});
```

#### Forced reactions and interrupts

Forced reactions and interrupts do not provide the player with a choice - unless cancelled, the effect will always resolve.

To declare a forced reaction, use the `forcedReaction` method:

```javascript
this.forcedReaction({
    title: 'Can\'t be discarded or remove fate',
    when: {
        onPhaseStarted: (event, context) => event.phase === 'fate' && context.player.opponent && 
                                            context.player.honor >= context.player.opponent.honor + 5
    },
    effect: 'stop him being discarded or losing fate in this phase',
    gameAction: ability.actions.cardLastingEffect({
        duration: 'untilEndOfPhase',    
        effect: [
            ability.effects.cardCannot('removeFate'),
            ability.effects.cardCannot('discardFromPlay')
        ]
    })
});
```

To declare a forced interrupt, use the `forcedInterrupt` method.

```javascript
this.forcedInterrupt({
    when: {
        onCardLeavesPlay: (event, context) => event.card === context.source && context.source.hasSincerity()
    },
    /// ...
    effect: '{1} draws a card due to {0}\'s Sincerity',
    effectArgs: context => context.player,
    gameAction: ability.actions.draw()
});
```

#### 'Would' interrupts

Some abilities allow the player to cancel an effect. These effects are always interrupts, and are usually templated as 'Interrupt: When [trigger] would....'.  These are implemented
using the `wouldInterrupt` method.  The context object for triggered ability has a useful `cancel` method which can be called in these cases

```javascript
this.wouldInterrupt({
    title: 'Cancel an event',
    when: {
        onCardAbilityInitiated: event => event.card.type === 'event'
    },
    cost: ability.costs.dishonor(card => card.hasTrait('courtier')),
    effect: 'cancel {1}',
    effectArgs: context => context.event.card,
    handler: context => context.cancel()
});
```

#### Abilities outside of play

Certain abilities, such as that of Vengeful Oathkeeper can only be activated in non-play locations. Such reactions should be defined by specifying the `location` property with the location from which the ability may be activated. The player can then activate the ability when prompted.

```javascript
this.reaction({
	when: {
		afterConflict: (event, context) => context.conflict.loser === context.player && context.conflict.conflictType === 'military'
	},
    location: 'hand',
    gameAction: ability.actions.putIntoPlay()
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
* **Bad**: Player1 chose to discard Miya Mystic
* **Good**: Player1 uses Isawa Masahiro to discard Miya Mystic
* **Good**: Player1 chooses to discard Miya Mystic

#### Targeting prompts should use the format "Choose a \<card type\>" where possible.

Targeting prompts should ask the player to choose a card or a card of particular type to keep prompt titles relatively short, without specifying the final goal of card selection.

* **Bad**: Choose a character to return to hand
* **Good**: Choose a character

**Exception:** If a card requires the player to choose multiple cards (e.g. Rebuild), or if a card requires the player's opponent to choose a card (e.g. Endless Plains) you can add context about which one they should be selecting. Just keep it as short as reasonably possible.

As valid selections are already presented to the user via visual clues, targeting prompts should not repeat selection rules in excessive details. Specifying nothing more and nothing less than the eligible card type (if any) is the good middle ground (this is what most prompts will default to).

* **Bad**: Choose a Bushi
* **Good**: Choose a character

* **Bad**: Choose a defending Crab character
* **Good**: Choose a character

* **Bad**: Choose a card from your discard pile
* **Good**: Choose a card

* **Good**: Choose an attachment or location
