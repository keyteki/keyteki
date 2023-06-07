# Better messages

A lot of cards have missing or default messages. Here is a small list of ways you can make a card message good.

By @alifeee

## Properties

When making an effect, these properties can be used for the messaging system:

```yaml
effect: string
  the effect of the card, sent in the chat
  Sent after "playerName uses cardName to <effect>" etc.
  Default arguments
    {0} context.target || context.source
    (CardAbility.js#149, CardAbility.js#59)
  (CardAbility.js#144)
effectArgs: string[] or function->string[]
  adds extra arguments available to effect text, i.e., {1}, {2}, etc.
  (CardAbility.js#150)
effectAlert: bool
  makes message into Alert (e.g., for Fogbank, Lifeward, Stealth Mode, etc.)
  (CardAbility.js#94)
effectStyle: "append" or "all" or null
  unsure what this does. seems to combine actions
  (CardAbility.js#115)
message: string
  displays a message in the chat. Can provide arguments with messageArgs.
  Default arguments
    {0} context.player
    {1} context.source.type
    {2} context.source
  (CardAbility.js#84)
```

## Abilities

When writing an ability, e.g., any of these:

```js
this.play(properties);
this.action(properties);
this.reaction(properties);
ability.effects.gainAbility('destroyed', properties);
this.destroyed(properties);
...
```

i.e., basically any action that is not a `then:`.

You should set `properties.effect`. Examples:

- Without `effect` (bad):
  - [Annihilation Ritual](../server/game/cards/01-Core/AnnihilationRitual.js)
  - [Anomaly Exploiter](../server/game/cards/01-Core/AnomalyExploiter.js)
- Simple examples with no formatting
  - [Ammonia Clouds](../server/game/cards/01-Core/AmmoniaClouds.js)
- More complex example using {0}
  - [Anger](../server/game/cards/01-Core/Anger.js)
  - [Daemo Alien](../server/game/cards/04-MM/DaemoAlien.js)
- Using `effectArgs`:
  - [A Fair Game](../server/game/cards/01-Core/AFairGame.js)
  - [Armageddon Cloak](../server/game/cards/01-Core/ArmageddonCloak.js)
