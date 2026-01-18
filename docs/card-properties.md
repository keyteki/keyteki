# Card Properties Reference

Card properties are values defined in the card's JSON data that are handled automatically by the game engine. **You do not need to implement these in card code.**

## Table of Contents

-   [Power](#power)
-   [Armor](#armor)
-   [Aember Bonus](#aember-bonus)
-   [Enhancements](#enhancements)
-   [Accessing Properties in Code](#accessing-properties-in-code)

## Power

Power determines how much damage a creature deals when it fights.

-   Defined in JSON as `"power": X`
-   Accessed via `card.power` (includes modifiers) or `card.printedPower`
-   Modified by effects like `ability.effects.modifyPower(amount)`

```json
{
    "id": "troll",
    "name": "Troll",
    "power": 8
}
```

## Armor

Armor reduces damage dealt to a creature. Each point of armor prevents 1 damage per turn.

-   Defined in JSON as `"armor": X`
-   Armor "resets" at the start of each turn
-   Accessed via `card.armor` (includes modifiers) or `card.printedArmor`
-   Modified by effects like `ability.effects.modifyArmor(amount)`

```json
{
    "id": "bulwark",
    "name": "Bulwark",
    "power": 5,
    "armor": 2
}
```

## Aember Bonus

The aember bonus (Æ icons in the card's top-left corner) represents bonus aember gained when the card is played.

-   Defined in JSON as `"amber": X`
-   Automatically added to the player's pool when the card is played
-   Accessed via `card.cardPrintedAmber`

```json
{
    "id": "dust-pixie",
    "name": "Dust Pixie",
    "amber": 2,
    "power": 1
}
```

## Enhancements

Enhancements are bonus icons added to cards (shown as pips). They provide additional effects when the card is played.

-   Defined in JSON as `"enhancements": ["aember", "capture", "damage", "draw"]`
-   Resolved automatically during the play sequence
-   Types: `aember` (gain 1Æ), `capture` (capture 1Æ), `damage` (deal 1 damage), `draw` (draw 1 card)

```json
{
    "id": "some-enhanced-card",
    "name": "Some Enhanced Card",
    "enhancements": ["aember", "draw"]
}
```

## Accessing Properties in Code

When implementing cards that reference these properties:

```javascript
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
