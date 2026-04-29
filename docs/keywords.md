# Keywords

Keywords in KeyForge are special abilities that appear on cards. In Keyteki, most keywords are handled automatically by the game engine based on the card's JSON data - **you do not need to implement them in card code**.

## Table of Contents

-   [List of Keywords](#list-of-keywords)
    -   [Alpha](#alpha)
    -   [Assault X](#assault-x)
    -   [Deploy](#deploy)
    -   [Elusive](#elusive)
    -   [Entrenched](#entrenched)
    -   [Exalt](#exalt)
    -   [Graft](#graft)
    -   [Haunted](#haunted)
    -   [Hazardous X](#hazardous-x)
    -   [Invulnerable](#invulnerable)
    -   [Omega](#omega)
    -   [Overwhelmed](#overwhelmed)
    -   [Poison](#poison)
    -   [Skirmish](#skirmish)
    -   [Splash-Attack X](#splash-attack-x)
    -   [Taunt](#taunt)
    -   [Treachery](#treachery)
    -   [Versatile](#versatile)
-   [How Keywords Work](#how-keywords-work)
-   [Cards That Grant Keywords](#cards-that-grant-keywords)
-   [Cards That Reference Keywords](#cards-that-reference-keywords)

## List of Keywords

These keywords are parsed from the card's JSON data and implemented automatically. **Do not reimplement them in card JavaScript files.**

### Alpha

> **Alpha** - You can only play this card before doing anything else this step.

The card can only be played as the first card of your turn. Handled automatically by play restrictions.

### Assault X

> **Assault X** - Before this creature attacks, deal X damage to the attacked creature.

When this creature initiates a fight, it deals X damage to the defender before the fight damage is exchanged. Handled in the fight resolution logic. If the creature is destroyed by the assault damage, the fight does not proceed, after fight abilities do not trigger, but the creature is still considered to have been in a fight for the purposes of other effects.

### Deploy

> **Deploy** - This creature can be played to any position in your battleline (not just the flanks).

Normally creatures must be played to a flank. Deploy allows placement anywhere. Handled in creature play logic. Creatures can be deployed even when they are put into play.

### Elusive

> **Elusive** - The first time this creature is attacked each turn, no damage is dealt.

The first time an elusive creature is attacked each turn, neither creature deals damage. This resets at the start of each turn. Tracked via `elusiveUsed` property on cards.

### Entrenched

> **Entrenched** - During your ready cards step, you may choose to not ready this creature.

An entrenched creature can optionally stay exhausted during the ready step. This is a player choice made during the ready cards step.

### Exalt

> **Exalt** - Place 1 aember from the common supply on this creature.

Exalting adds aember to a creature, and otherwise behaves like captured aember. Handled via `ExaltAction`.

### Graft

> **Graft** - This creature enters play with another card grafted to it.

Grafted cards are put faceup under another card. The grafted location is a separate out of play zone. Handled in the card play logic.

### Haunted

> **Haunted** - While you have 10 or more cards in your discard pile, this creature gains abilities.

Haunted creatures check the discard pile count via `player.isHaunted()` to determine if their Haunted abilities are active.

### Hazardous X

> **Hazardous X** - Before this creature is attacked, deal X damage to the attacker.

When this creature is attacked, it deals X damage to the attacker before fight damage is exchanged. Handled in fight resolution logic. If the attacker is destroyed by the hazardous damage, the fight does not proceed, after fight abilities do not trigger, but the creature is still considered to have been in a fight for the purposes of other effects.

### Invulnerable

> **Invulnerable** - This creature cannot be dealt damage or destroyed.

A creature with Invulnerable cannot be dealt damage or destroyed by any means. Handled via persistent effects that prevent damage and destruction. The be removed from play by other means (e.g., returned to hand or archived).

### Omega

> **Omega** - After you play this card, end this step (you cannot play, use, or discard any more cards this turn).

After playing an Omega card, your current step immediately ends - this is typically the "play and use cards" step. Handled by game flow logic.

### Overwhelmed

> **Overwhelmed** - This ability is active if your opponent has more creatures in play than you.

Overwhelmed is a condition that enables or modifies abilities based on creature count comparison. Cards check `player.opponent.creaturesInPlay.length > player.creaturesInPlay.length`.

### Poison

> **Poison** - Any damage dealt by this creature to another creature is enough to destroy that creature.

If a creature with Poison deals any amount of damage to another creature during a fight, that creature is destroyed. Handled in damage resolution.

### Skirmish

> **Skirmish** - When this creature fights, it does not take damage from the creature it fights.

The skirmish creature deals its damage normally but doesn't receive damage from the defender. Handled in fight resolution.

### Splash-Attack X

> **Splash-Attack X** - When this creature attacks, deal X damage to each of the attacked creature's neighbors.

When attacking, deals X damage to the neighbors of the creature being attacked. A creature that dies from splash-attack damage is considered to be destroyed fighting the attacking creature. Handled in fight resolution logic.

### Taunt

> **Taunt** - Enemies can only attack this creature's neighbors if they have taunt.

Creatures adjacent to a taunt creature cannot be attacked unless they also have taunt. Handled via a persistent effect that prevents attacking neighbors.

### Treachery

> **Treachery** - This card enters play under your opponent's control.

When played, the card is placed under the opponent's control instead of your own. Handled by play logic that checks for the treachery keyword.

### Versatile

> **Versatile** - This card can be played or used regardless of which house you chose this turn.

A versatile card bypasses the house restriction, allowing it to be played or used even if you didn't choose its house. Handled via play/use restriction checks.

## How Keywords Work

Keywords are defined in the card's JSON data in `keyteki-json-data/packs/`:

```json
{
    "id": "troll",
    "name": "Troll",
    "keywords": ["skirmish"],
    "power": 8,
    "armor": 0
}
```

Keywords with values (like Assault or Hazardous) are formatted as `"keyword:value"`:

```json
{
    "id": "ganger-chieftain",
    "name": "Ganger Chieftain",
    "keywords": ["assault:2"],
    "power": 5,
    "armor": 0
}
```

The `Card.js` base class parses these keywords and creates the appropriate persistent effects automatically:

```javascript
// From Card.js - you don't need to write this
for (let keyword of cardData.keywords || []) {
    let split = keyword.split(':');
    let value = 1;
    if (split.length > 1) {
        value = parseInt(split[1]);
    }
    this.printedKeywords[split[0]] = value;
    this.persistentEffect({
        location: 'any',
        effect: AbilityDsl.effects.addKeyword({ [split[0]]: value })
    });
}
```

## Cards That Grant Keywords

Some cards grant keywords to other cards. Use `ability.effects.addKeyword()`:

```javascript
// Grant taunt to attached creature
this.whileAttached({
    effect: ability.effects.addKeyword({ taunt: 1 })
});
```

```javascript
// Grant skirmish to all friendly creatures
this.persistentEffect({
    match: (card) => card.type === 'creature',
    targetController: 'self',
    effect: ability.effects.addKeyword({ skirmish: 1 })
});
```

```javascript
// Grant assault 2 to a creature until end of turn
this.play({
    target: {
        cardType: 'creature',
        gameAction: ability.actions.cardLastingEffect({
            duration: 'untilPlayerTurnEnd',
            effect: ability.effects.addKeyword({ assault: 2 })
        })
    }
});
```

## Cards That Reference Keywords

Some cards check for or interact with keywords. Use `card.getKeywordValue()` or `card.hasKeyword()`:

```javascript
// Check if a card has taunt
if (card.getKeywordValue('taunt') > 0) {
    // Card has taunt
}

// Get assault value
const assaultValue = card.getKeywordValue('assault');

// Condition based on keyword
this.play({
    target: {
        cardType: 'creature',
        cardCondition: (card) => card.getKeywordValue('elusive') > 0,
        gameAction: ability.actions.destroy()
    },
    effect: 'destroy {0} because it has elusive'
});
```
