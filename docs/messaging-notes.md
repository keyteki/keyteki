# Messaging Notes - TODO - remove before merge

-   Does pushframe ever come without pushClause? Couldn't pushFrame accept args and then it pushes a frame and a clause, and then later uses can pushClause if necessary
-   Add a test to the mimicry tests for wild wormhole -> mimicry -> eureka to make sure it returns to top of deck

## Things to look at afterwards

-   CardAbility.js has a lot of message handling that may be hoistable
-   Why is push frame and push clause needed separately?
-   resolveBonusIconAs order should be flipped old -> new: effect: ability.effects.mayResolveBonusIconsAs('steal', 'capture')
-   Can affects blocks an event from happening (eg capture 0) so thus no messaging is emitted - is there a way around this?
-   if (!clause) {return;} is on most renders - is this necessary, what happens if its removed, or can it be universally handled in the narration system?
-   remove logDraw: true after migrating mulligan
-   lastingAbilityTrigger should be renamed to lastingEffectTrigger - constant abilities are considered to have lasting effects
-   PlayAction could be renamed PlayFromHand

## Lasting effects

Curious for opinion for messaging - currently dimension door declares its lasting effect:

```
2026-06-15 23:10:25 player1 plays Dimension Door
2026-06-15 23:10:25 player1 uses Dimension Door to steal amber instead of gaining it while reaping for the remainder of the turn
2026-06-15 23:10:25 player1 reaps with Dextre to steal 1 amber
```

If I remove the custom message, then TCO uses a generic message:

```
2026-06-15 23:10:02 player1 plays Dimension Door
2026-06-15 23:10:02 player1 uses Dimension Door to apply a lasting effect
2026-06-15 23:10:02 player1 reaps with Dextre to steal 1 amber
```

But imo if the message logs what happened, then either the second line just doesn't need to happen, or we need some way to generate the lasting effect message without having to write a custom one in the card code.

## Future work (punted)

### game.js refactor

`game.js` is 1,677 lines / 91 methods — a god object with player lookup, UI prompts, game state checks, turn lifecycle, and networking all mixed together. Extracting `checkGameState` + `takeControl` into a `GameStateManager` would be clean, but every `context.game.*` reference across hundreds of files would need updating. The 38k test suite provides safety but it's weeks of work. Defer until there's a dedicated refactor effort.

### Effect expiration messaging (control reversion, house reversion, etc.)

When a lasting effect expires (e.g., Harland Mindlock dies → Troll returns to opponent), no message is logged. Adding a generic "X returns to player2's control" in `checkGameState` would be ~3 lines, but:

-   The same pattern applies to many other "state reverts" (house changes back, power modifier expires, etc.) — none of those have reversion messages today either.
-   We're not missing anything players relied on before; this would be net-new information.
-   The narration system can't cleanly handle expiry because it happens outside EventWindows (in a state-reconciliation pass with no source/ability context).
-   Overlapping effects make it worse — an effect can expire without the card actually changing controller.

Defer until there's a broader "state change notifications" design, potentially tied to the game.js refactor.
