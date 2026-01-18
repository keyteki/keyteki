# Better messages

A lot of cards have missing or default messages. Here is a small list of ways you can make a card message good.

By @alifeee

## Properties for actions/reactions/etc

When making an effect, these properties can be used for the messaging system:

### Flow

```js
Card.action(properties)
-> new CardAction(this.game, this, properties)
-> CardAction extends CardAbility
-> CardAbility.displayMessage(context)
```

### `properties` keys

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
    (CardAbility.js#46)
  (CardAbility.js#84)
messageArgs: string or string[] or function->string[]
  arguments to replace {3}, {4}, etc. in message
  (CardAbility.js#85, CardAbility.js#38)
preferActionPromptMessage: bool
  not sure why this exists
  skips the execution of CardAbility.displayMessage(context)
  (CardAbility.js#80)
```

These are not messages but are helpful to remember:

```yaml
optional: bool
    Whether the effect is optional
    (AbilityTargetSelect.js#107, triggeredability.js#44)
```

You should at least set `properties.effect`. Examples:

-   Without `effect` (bad):
    -   [Annihilation Ritual](../server/game/cards/01-Core/AnnihilationRitual.js)
    -   [Anomaly Exploiter](../server/game/cards/01-Core/AnomalyExploiter.js)
-   Simple examples with no formatting
    -   [Ammonia Clouds](../server/game/cards/01-Core/AmmoniaClouds.js)
-   More complex example using {0}
    -   [Anger](../server/game/cards/01-Core/Anger.js)
    -   [Daemo Alien](../server/game/cards/04-MM/DaemoAlien.js)
-   Using `effectArgs`:
    -   [A Fair Game](../server/game/cards/01-Core/AFairGame.js)
    -   [Armageddon Cloak](../server/game/cards/01-Core/ArmageddonCloak.js)

## Properties for "then" effects

The "then" effects do not have a `effect` prop, so you should use `message`.

### Flow for "then" effects

```js
Card.action(properties)
-> new CardAction(this.game, this, properties)
-> CardAction extends CardAbility
-> CardAbility extends ThenAbility
-> ThenAbility.displayMessage(context)
```

### "then" Properties keys

```yaml
message: string
    displays a message in the chat. Can provide arguments with messageArgs.
    Default arguments
    {0} context.player
    {1} context.source
    {2} context.target
    (ThenAbility.js#31)
    (ThenAbility.js#30)
messageArgs: string[] or function->string[]
    arguments to replace {3}, {4}, etc. in message
    (ThenAbility.js#32)
effectAlert: bool
    makes message into Alert (e.g., for Fogbank, Lifeward, Stealth Mode, etc.)
    (ThenAbility.js#41)
```

These are not messages but are helpful to remember:

```yaml
may: bool
    prompt to ask "Yes"/"No" to make an action optional
    (ThenAbility.js#60)
alwaysTriggers: bool
    whether the effect always triggers
    (ThenAbility.js#26)
```

You should at least set `properties.message`. Examples:

-   Without `message` (bad):
    -   [Bear Flute](../server/game/cards/01-Core/BearFlute.js)
    -   [Cincinnatus Rex](../server/game/cards/03-WC/CincinnatusRex.js)
-   Simple examples with no formatting
    -   [Hugger Mugger](../server/game/cards/03-WC/HuggerMugger.js)
-   More complex example using {0}, {1}, {2}
    -   [Bait and Switch](../server/game/cards/01-Core/BaitAndSwitch.js)
    -   [The Big One](../server/game/cards/03-WC/TheBigOne.js)
    -   [Chant of Hubris](../server/game/cards/03-WC/ChantOfHubris.js)
-   Using `messageArgs`
    -   [J. Vinda](../server/game/cards/03-WC/JVinda.js)
    -   [Agent Sepdia](../server/game/cards/05-DT/AgentSepdia.js)

## Using `target`

Finally, whenever you use `target`, you can use:

```yaml
mode: "select" or "house" or "ability" or "trait" or "card-name" or "options"
    what to select
    (baseability.js#77)
activePromptTitle: string
    the title of the prompt
    (AbilityTargetSelect.js#93, AbilityTargetHouse.js#51, etc...)
```

Examples:

-   Without `activePromptTitle` (bad)
    -   [Bulleteye](../server/game/cards/01-Core/Bulleteye.js)
    -   [Cannon](../server/game/cards/01-Core/Cannon.js)
-   With `activePromptTitle`
    -   [Battle Fleet](../server/game/cards/01-Core/BattleFleet.js)
    -   [Dreadbone Decimus](../server/game/cards/04-MM/DreadboneDecimus.js)

## Locales

Messages used should be in the locale files in [`public/locales`](../public/locales/). Otherwise, tests may fail.

-   `properties.may`
-   `properties.gameAction.promptForSelect.activePromptTitle`
-   `properties.gameAction.promptWithHandlerMenu.activePromptTitle`
-   `properties.target.activePromptTitle`
-   `properties.target.choices`

## Line numbers

All file line numbers and examples given above are based on commit db04e05ffe5725119f2dffda16ccca87814c55b6
