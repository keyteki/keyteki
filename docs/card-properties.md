# Card Properties

Card properties are values defined in the card's JSON data that are handled automatically by the game engine. **You do not need to implement these in card code.**

## Table of Contents

-   [Example JSON data](#example-json-data)
-   [House](#house)
-   [Power](#power)
-   [Armor](#armor)
-   [Aember Bonus](#aember-bonus)
-   [Enhancements](#enhancements)
-   [Accessing Properties in Code](#accessing-properties-in-code)
-   [Properties on Gigantics](#properties-on-gigantics)

## Example JSON data

```json
{
    "id": "example",
    "name": "Example",
    "house": "brobnar",
    "type": "creature",
    "power": 8,
    "armor": 2,
    "amber": 1,
    "enhancements": ["aember", "draw", "capture", "damage"]
}
```

## House

The house determines which house must be active to play or use the card.

-   Defined in JSON as `"house": "housename"` (lowercase)
-   Valid houses include: `brobnar`, `dis`, `logos`, `mars`, `sanctum`, `shadows`, `untamed`, `saurian`, `staralliance`, `unfathomable`, `ekwidon`, `geistoid`, `skyborn`
-   Accessed via `card.house` (current house, may be modified) or `card.printedHouse`
-   Cards with house enhancements can be played/used as if they belong to an additional house
-   Some effects can change a card's house temporarily

## Power

Power determines how much damage a creature deals when it fights. If a creature has equal or greater damage than its power then it is destroyed.

-   Defined in JSON as `"power": X`
-   Accessed via `card.power` (includes modifiers) or `card.printedPower`
-   Modified by effects like `ability.effects.modifyPower(amount)`

## Armor

Armor reduces damage dealt to a creature. Each point of armor prevents 1 damage per turn.

-   Defined in JSON as `"armor": X`
-   Armor "resets" at the start of each turn
-   Accessed via `card.armor` (includes modifiers) or `card.printedArmor`
-   Modified by effects like `ability.effects.modifyArmor(amount)`

## Aember Bonus

The aember bonus (Æ icons in the card's top-left corner) represents bonus aember gained when the card is played.

-   Defined in JSON as `"amber": X`
-   Automatically added to the player's pool when the card is played
-   Accessed via `card.cardPrintedAmber`

## Enhancements

Enhancements are bonus icons added to cards (shown as pips). They provide additional effects when the card is played.

-   Defined in JSON as `"enhancements": ["aember", "capture", "damage", "draw"]`
-   Resolves when a card is played, after persistent effects come into effect and before any "play" or "after play" abilities resolve.
-   Enhancements and bonus icons are resolved one at a time, in the order they are listed in the enhancements array.
-   Enhancements and bonus icons always resolve, even if a previous enhancement caused the card to leave play (e.g. dealing damage that destroys itself).
-   Cards are limited to 5 enahancements/bonus icons total.
-   Types:
    -   `aember`: player gains 1 aember
    -   `capture`: player captures 1 aember on to any friendly creature
    -   `damage`: player deals 1 damage to any creature in play
    -   `draw`: player draws 1 card
    -   `discard`: player discards 1 card from hand
    -   `plus-power`: player gives a creature a +1 power counter
-   House enhancements: Cards can also have house enhancements that allow that card to be played or used as if it were of that house.
    -   The enhancements array just names the house, e.g. `"enhancements": ["dis"]`
    -   Cards are limited to 1 house enhancement
    -   House enhancements are not resolveable, they just modify play/use restrictions

## Accessing Properties in Code

When implementing or testing cards that reference these properties:

```javascript
const house = card.house; // Get current house
const printedHouse = card.printedHouse; // Get printed house

// Get a creature's current power (with all modifiers)
const power = card.power;

// Get printed power (base value without modifiers)
const basePower = card.printedPower;

// Get current armor
const armor = card.armor;

// Get aember bonus
const amberBonus = card.cardPrintedAmber;

// Check enhancements
const enhancements = card.enhancements; // Array of enhancement types

// Example: Deal damage equal to a creature's power
this.play({
    target: {
        cardType: 'creature',
        gameAction: ability.actions.dealDamage((context) => ({
            amount: context.target.power
        }))
    }
});

// Example: Condition based on power
this.play({
    target: {
        cardType: 'creature',
        cardCondition: (card) => card.power <= 3,
        gameAction: ability.actions.destroy()
    },
    effect: 'destroy {0}'
});
```

## Properties on Gigantics

The JSON data lists the same properties for both halves of a gigantic card. However, when not in play, the top half of a gigantic card only has the name, house, card type, and bonus icons defined. The bottom half of a gigantic card only has the name, house, card type, power, armor, and text box defined. The engine automatically handles this distinction.

When a gigantic card is in play, both halves have all properties defined as normal.
