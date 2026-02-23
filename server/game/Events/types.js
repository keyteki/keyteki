/**
 * Definition of all the event names in KeyForge that can be raised or listened
 * to.
 *
 * The “params” noted below have been `extend`ed on to the given `Event`
 * objects. All events typically have a `context` param, so we do not mention it
 * below.
 *
 * Events are typically created by the different {@link GameAction} subclasses.
 * They serve both as a notification that something is happening and the
 * implementation of that something (by virtue of being given a `handler`
 * function by the Action).
 *
 * When writing a listener for an event, pay attention to the specific triggers
 * and Actions mentioned below. Some events have generic-sounding names, like
 * `onRemoveToken`, but that doesn’t mean that they necessarily trigger every
 * time a counter is removed from a card. For example, no `onRemoveToken` event
 * fires if you use a creature to pop a stun.
 *
 * During the `interrupt` listening phase, other effects can be notified of the
 * Event’s impending resolution. They can use a {@link ChangeEventAction} to
 * update the event’s params and therefore alter its behavior, or cancel it
 * entirely to prevent resolution.
 *
 * The `reaction` phase happens after the `handler` has executed, and notably
 * will _not_ happen if the event was cancelled (_e.g._ a creature in a fight
 * sustained lethal damage from assault before the rest of the fight could
 * resolve).
 *
 * This means that below we describe events both as triggering when something is
 * _about_ to happen as well as sometimes the mechanical implementation of that
 * “something.” Note however that the execution is determined by the **action**
 * and is not an inherent property of the event type. Some events are created in
 * multiple places (`onUseCard` is a good example) and their creators are free
 * to give them different handlers, though this is generally rare.
 */
const EVENTS = /** @type {const} */ ({
    /**
     * Triggered when a lasting effect is applied to the game state.
     *
     * No params.
     *
     * @see LastingEffectAction
     * @see CardLastingEffectAction
     */
    applyLastingEffect: 'applyLastingEffect',

    /**
     * Triggered at the start an ability happening. Listened to by mimicry
     * effects to be able to adopt another card’s abilities as soon as possible.
     *
     * @see AbilityResolver
     */
    onAbilityInitiated: 'onAbilityInitiated',

    /**
     * Triggered as a notification after an ability has completed.
     *
     * @see AbilityResolver
     */
    onAbilityResolved: 'onAbilityResolved',

    /**
     * Triggered when one or more card abilities are happening due to a
     * `resolveAbility` call.
     *
     * Params:
     * * `card` - The {@link Card} whose abilities are being triggered.
     *
     * @see ResolveAbilityAction
     */
    onAction: 'onAction',

    /**
     * Triggered when a player wants to play a Fate card under one of their Prophecies.
     *
     * Params:
     * * `player` — The {@link Player} who is activating one of their prophecies.
     *
     * @see ActivateProphecyAction
     */
    onActivateProphecy: 'onActivateProphecy',

    /**
     * Triggered when a token of (almost) any type is being added to a card.
     * Often listened to in order to excute “when there are X or more _ tokens…”
     * effects, such as {@link Redacted}.
     *
     * Is not used by {@link EnrageAction} and so will not fire when a card is
     * enraged.
     *
     * Params:
     * * `card` - The {@link Card} that the tokens are being added to.
     * * `amount` — The number of tokens being added, if it is a fixed number (as
     *   opposed to a multiplication).
     *
     * @see AddTokenAction
     */
    onAddToken: 'onAddToken',

    /**
     * Triggered when a player adds their archives to their hand during the
     * house phase of the game.
     *
     * Params:
     * * `player` — The {@link Player} picking up their archives.
     *
     * @see HousePhase
     */
    onArchivesAddedToHand: 'onArchivesAddedToHand',

    /**
     * Triggered when æmber is deducted from a player’s pool and added as tokens
     * on a creature.
     *
     * Params:
     * * `card` — The {@link Card} that is getting the æmber.
     * * `amount` — The actual amount of æmber being transfered, given the target
     *   player’s current amount.
     *
     * @see CaptureAction
     */
    onCapture: 'onCapture',

    /**
     * Triggered when a card is being archived from any location.
     *
     * Params:
     * * `card` — The {@link Card} being archived.
     *
     * @see ArchiveAction
     */
    onCardArchived: 'onCardArchived',

    /**
     * Triggered when an Upgrade is attached to a Creature or Artifact.
     *
     * Params:
     * * `card` — The Upgrade {@link Card} being attached.
     * * `parent` — The {@link Card} being played on to.
     * * `player` — The current {@link Player}.
     *
     * @see AttachAction
     */
    onCardAttached: 'onCardAttached',

    /**
     * Triggered when a card is being, well, destroyed.
     *
     * Params:
     * * `card` — The {@link Card} that is being destroyed.
     * * `damageEvent` — The instance of an `onDamageApplied` {@link Event}, if
     *   damage exceeding power is what caused the card’s destruction.
     *
     * @see DestroyAction
     */
    onCardDestroyed: 'onCardDestroyed',

    /**
     * Triggered when a card is being discarded to the discard.
     *
     * Params:
     * * `card` — The {@link Card} that is being discarded.
     * * `location` — The current location of the card, before being discarded.
     *
     * @see DiscardCardAction
     */
    onCardDiscarded: 'onCardDiscarded',

    /**
     * Triggered when a Creature is being enraged.
     *
     * Params:
     * * `card` — The {@link Card} that is being enraged.
     *
     * @see EnrageAction
     */
    onCardEnraged: 'onCardEnraged',

    /**
     * Triggered when a card is put into play. After this Event resolves, the
     * card will be in the "play area" location and will be exhausted, stunned,
     * or enraged as appropriate based on its card text and other game effects.
     *
     * Params:
     * * `card` — The {@link Card} being put into play.
     *
     * @see PutIntoPlayAction
     */
    onCardEntersPlay: 'onCardEntersPlay',

    /**
     * Triggered when a card is being exhausted, either through a card effect or
     * as the cost of using a card or removing a stun. Does not trigger when a
     * card enters play exhausted.
     *
     * Params:
     * * `card` — The {@link Card} that’s exhausted.
     *
     * @see ExhaustAction
     */
    onCardExhausted: 'onCardExhausted',

    /**
     * Triggered when a card is “grafted” on to another as the result of a card
     * ability (_E.g._ Infomancer). Exclusive with `onPlaceUnder`.
     *
     * Params:
     * * `card` — The {@link Card} being grafted.
     *
     * @see PlaceUnderAction
     */
    onCardGrafted: 'onCardGrafted',

    /**
     * Triggered when a card moves out of the "play area" location.
     *
     * Because this event is triggered from a number of different actions, the
     * list of params is not consistent, with the exception of `card`.
     *
     * @see ArchiveAction
     * @see DestroyAction
     * @see PlaceUnderAction
     * @see PurgeAction
     * @see ReturnToDeckAction
     * @see ReturnToHandAction
     */
    onCardLeavesPlay: 'onCardLeavesPlay',

    /**
     * Triggered as the result of a card changing its `location` for any reason.
     * (Not triggered when it moves within the same location, like from one side
     * of the battle line to the other.)
     *
     * Params:
     * * `card` — The {@link Card} being moved.
     * * `originalLocation` — The card’s previous location.
     * * `newLocation` — The card’s new, current location.
     *
     * @see Card#moveTo
     *
     * @deprecated This is fully covered by `onCardPlaced`. The only listener,
     * Etan’s Jar, should probably deactivate its effect after leaving play
     * rather than moving.
     */
    onCardMoved: 'onCardMoved',

    /**
     * Triggered as the result of generic “move anywhere in the battleline”
     * effects.
     *
     * Params:
     * * `card` — The {@link Card}.
     *
     * @see MoveOnBattlelineAction
     */
    onCardMovedInBattleline: 'onCardMovedInBattleline', // none

    /**
     * Triggered after a card has moved from one `location` to another and its
     * instance has been added to the collection of cards associated with that
     * location.
     *
     * Params:
     * * `card` — The {@link Card} that moved.
     * * `cloneOverride` — The snapshot of the {@link Card} before it was moved
     *   (and lost tokens, _&c._).
     * * `from` — Its previous location.
     * * `to' — The new location.
     * * `drawn` — True if the placement happened because of a card drawn off
     *   the top of the deck and into the player’s hand.
     *
     * @see Player#moveCard
     */
    onCardPlaced: 'onCardPlaced',

    /**
     * Triggered when a card is played from any location.
     *
     * Params:
     * * `card` — The {@link Card} being played.
     * * `player` — The {@link Player} playing the card.
     * * `originalLocation` — Where the `card` is being played _from_.
     *   Typically, but not always, `'hand'`.
     *
     * @see BasePlayAction
     */
    onCardPlayed: 'onCardPlayed',

    /**
     * Triggered after bonus icons have been resolved but before any “Play:”
     * effects have occurred. Canceling the event at this point will prevent an
     * Action card’s (at least) “Play:” effect from executing.
     *
     * Params:
     * * `card` — The {@link Card} being played.
     * * `player` — The {@link Player} playing the card.
     *
     * @see BasePlayAction
     * @see Bryozoarch
     */
    onCardPlayedAfterBonusIcons: 'onCardPlayedAfterBonusIcons',

    /**
     * Triggered when a card is purged from any location. Goes off before
     * `onCardLeavesPlay`.
     *
     * Params:
     * * `card` — The {@link Card}.
     *
     * @see PurgeAction
     */
    onCardPurged: 'onCardPurged',

    /**
     * Triggered when a card is made ready as the result of another card effect
     * or during the Ready phase at the end of the turn.
     *
     * **NOTE:** Can trigger on cards that are already ready. Check the
     * `exhausted` param if you’re listening for cases where the card is
     * actually being readied from exhausted.
     *
     * Params:
     * * `card` — The {@link Card}.
     * * `exhausted` — True if the card was exhausted before this event’s action
     *   was applied.
     *
     * @see ReadyAction
     */
    onCardReadied: 'onCardReadied',

    /**
     * Event for the start of the “ready cards” step at the end of the turn.
     * Provided so that cards can substitute the entire ready phase (currently
     * this is just The Chosen One).
     *
     * Params:
     * * `player` — The {@link Player} whose turn it is.
     * * `cards` — All of the cards `player` has in play, regardless of
     *   exhausted / ready state.
     *
     * @see ReadyPhase
     */
    onCardsReadied: 'onCardsReadied',

    /**
     * Triggered after the active player has chosen their house at the start of
     * their turn.
     *
     * Params:
     * * `player` — The active {@link Player}.
     * * `house` — The name of the chosen house (lowercase).
     *
     * @see HousePhase
     */
    onChooseActiveHouse: 'onChooseActiveHouse',

    /**
     * Event triggered for applying damage tokens to a creature based on
     * incoming damage. Responsible for triggering the destroy action when
     * damage exceeds power or because of poison damage during a fight.
     *
     * Params:
     * * `card` — The {@link Card} receiving the damage.
     * * `amount` — The numerical amount of damage.
     * * `damageType` — Default is `'card effect'` but can be `'assault'`,
     *   `'hazardous'`, or `'splash-attack'` as well.
     * * `bonus` — True if this damage is the result of a damage bonus icon on a
     *   card.
     * * `damageSource` — The {@link Card} that caused the damage to occur, if
     *   there is one (for example, the other creature in a fight).
     * * `damageDealtEvent` — The `onDamageDealt` event that is causing the
     *   damage to be applied.
     * * `fightEvent` — If the damage was dealt due to a fight, that `onFight`
     *   event.
     * * `destroyEvent` — `null` until the event is executed, and then
     *   afterwards a reference to any `onCardDestroyed` event that resulted
     *   from lethal damage or poison.
     *
     * @see ApplyDamageAction
     */
    onDamageApplied: 'onDamageApplied',

    /**
     * Event triggered when damage is dealt to a Creature under any circumstance
     * (direct, fight, hazardous/assault, bonus pip, _&c._). Will get created
     * but then canceled if the damage is prevented by a ward.
     *
     * Params:
     * * `card` — The {@link Card} receiving the damage.
     * * `amount` — The total amount being dealt (before armor), including any
     *   bonus damage applied from other effects.
     * * `damageSource` — The {@link Card} that caused the damage to occur, if
     *   there is one (for example, the other creature in a fight).
     * * `fightEvent` — If this damage is happening as part of the normal fight
     *   damage exchange, this will be the `onFight` {@link Event}. Will not be
     *   set during assault/hazardous damage.
     * * `bonus` — `true` if this damage is coming from a damage bonus icon.
     * * `damageType` — Default is `'card effect'` but can be `'assault'`,
     *   `'hazardous'`, or `'splash-attack'` as well.
     * * `ignoreArmor` — True if the damage should ignore armor.
     *
     * @see DealDamageAction
     */
    onDamageDealt: 'onDamageDealt',

    /**
     * Triggered when armor prevents at least some damage from being applied.
     *
     * Params
     * * `card` — The {@link Card} receiving the damage.
     * * `amount` — The amount of damage that got through the armor.
     * * `armorUsed` — The amount of armor that was used up blocking damage.
     *   Will always be greater than 0.
     *
     * @see DealDamageAction
     * @see MaruckTheMarked
     */
    onDamagePreventedByArmor: 'onDamagePreventedByArmor',

    /**
     * Triggered when a prophecy is no longer active, either because it was
     * fulfilled, it was flipped (Heads I Win / Tails You Lose), or because it
     * was deactivated during manual mode.
     *
     * Params:
     * * `player` — The {@link Player} whose prophecy is being deactivated.
     *
     * @see DeactivateProphecyAction
     */
    onDeactivateProphecy: 'onDeactivateProphecy',

    /**
     * Triggered as a notification after a player’s deck was shuffled.
     *
     * Params:
     * * `player` — The {@link Player} whose deck was shuffled.
     * * `shuffledDiscardIntoDeck` — `true` if the player’s discard pile was
     *   shuffled into their deck.
     *
     * @see Player#shuffleDeck
     */
    onDeckShuffled: 'onDeckShuffled',

    /**
     * Triggered when a player draws cards for any reason: refilling their hand
     * or as the result of a card effect or bonus icon.
     *
     * Params:
     * * `player` — The {@link Player} drawing the cards.
     * * `amount` — The actual number of cards being drawn (so _after_ chains
     *   have been taken into account if the draw is during the refill hand
     *   step).
     * * `bonus` — True if the draw is from a draw card bonus icon.
     * * `shedChains` — True if the player should lose a chain because chains
     *   prevented them from drawing up to their max hand size during the refill
     *   hand step.
     *
     * @see DrawAction
     */
    onDrawCards: 'onDrawCards',

    /**
     * Triggered when a lasting or delayed effect is getting added in to the
     * effects affecting the game’s behavior.
     *
     * Params differ between a lasting effect and a delayed effect. Since these
     * events are not being listened to, we won’t enumerate them here.
     *
     * @see CardLastingEffectAction
     * @see DelayedEffectAction
     */
    onEffectApplied: 'onEffectApplied', //none

    /**
     * Triggered when a Creature is exalted by another effect. Results in
     * `amber` tokens being applied to the card.
     *
     * Params:
     * * `card` — The card being exalted
     * * `amount` — The amount of amber to exhalt with. Does not include extra
     *   amber added by _e.g._ Kretchee.
     *
     * @see ExaltAction
     */
    onExalt: 'onExalt',

    /**
     * Triggered after a prophecy has been fulfilled and deactivated, but before
     * the fate card is moved to the discard. Cards will interrupt this event
     * with their “Fate:” effects by registering an effect with {@link Card#fate}.
     *
     * Params:
     * * `card` — The card whose Fate effect is going off.
     *
     * @see ResolveFateAction
     * @see Card#fate
     */
    onFate: 'onFate',

    /**
     * Triggered after attacker and defender are chosen and the fight is
     * happening. This event will cause {@link DealDamageAction} events to go
     * off to apply necessary damage. This event will also trigger an
     * `onUseCard` event with itself as that event’s `fightEvent` property.
     *
     * Note that if hazardous, assault, or any other effect destroys one of the
     * creatures before fight damage is applied, this event will be _cancelled_
     * and `onFight` `reaction` listeners will not be called. If you need to
     * track whether or not the fight was attempted in the first place, use
     * `onUseCard` and check its `fight`/`fightEvent` params.
     *
     * Params:
     * * `card` — The {@link Card} defending in the fight.
     * * `attacker` — The attacking {@link Card}.
     * * `attackerClone` — A snaphot of the attacking {@link Card}, taken when
     *   the event is created.
     * * `attackerTarget` — The {@link Card} the attacker will actually deal
     *   damage do. Starts the same as `card` but may be changed (_e.g._ by
     *   Gabos Longarms).
     * * `attackerTargetClone` — A snapshot of the `attackerTarget`, taken when
     *   the event is created. (Note: changes to `attackerTarget` do not update
     *   `attackerTargetClone`.)
     * * `defenderTarget` — The {@link Card} the defender will deal damage to.
     *   Defaults to `attacker`, but separated in case a card effect needs to
     *   change it.
     * * `destroyed` — An array of {@link Card}s that were destroyed in the
     *   fight. Starts out empty, is populated by {@link ApplyDamageAction}.
     * * `cancelFight` — Starts as `false`. Interrupt handlers can set this to
     *   `true` to cause the `onFight` event to be cancelled. (See
     *   {@link EvasionSigil}.)
     *
     * @see ResolveFightAction
     */
    onFight: 'onFight',

    /**
     * Triggered after `onTurnStart` but before the key forging step. Provided
     * so that {@link NiborFlamewing} and potentially other cards can loop
     * effects at the beginning of the turn.
     *
     * Params:
     * * `player` — The {@link Player} whose turn is just starting.
     * * `somethingChanged` — Defaults to `false`. If an `interrupt` sets this
     *   to `true`, another `onFinalizeBeginRound` event will be triggered from
     *   this one, to a maximum of 100 loops (to prevent accidental infinite
     *   looping).
     *
     * @see Game#finalizeBeginRound
     */
    onFinalizeBeginRound: 'onFinalizeBeginRound',

    /**
     * Triggered from the action that flips a prophecy over to its other side.
     *
     * Params:
     * * `player` — The player whose prophecy it is.
     *
     * @see FlipProphecyAction
     * @see HeadsIWin
     * @see TailsYouLose
     */
    onFlipProphecy: 'onFlipProphecy',

    /**
     * Triggered when a card is flipped from Token Creature to not, or a
     * Creature card is flipped to Token Creature. If a Token Creature is
     * flipped to reveal a non-Creature card, this will discard it
     * automatically.
     *
     * Params:
     * * `card` — The card being flipped.
     * * `player` — The current player.
     *
     * @see FlipAction
     */
    onFlipToken: 'onFlipToken',

    /**
     * Triggered when a player is forging a key, either due to having enough
     * æmber during their “Forge a Key” step or due to a key cheat effect.
     *
     * Params:
     * * `player` — The player doing the forging.
     * * `modifier` — A value added to the current key cost to calculate the
     *   ultimate price of the key. For effects that “forge a key at no cost,”
     *   this will be set to the negative current cost for the key so that
     *   arithmetic comes out 0.
     *
     * @see ForgeAction
     */
    onForgeKey: 'onForgeKey',

    /**
     * Triggered when a prophecy’s condition has occurred and it’s about to be
     * fulfilled. This will generate `onDeactivateProphecy` and `onFate` events
     * though their appropriate actions.
     *
     * Params:
     * * `player` — The {@link Player} whose turn it is, _not_ the controller of
     *   the prophecy.
     * * `card` — The prophecy {@link Card}.
     *
     * @see FulfillProphecyAction
     */
    onFulfillProphecy: 'onFulfillProphecy',

    /**
     * Triggered after mulligans are offered/taken, right before the first player’s first
     * turn.
     *
     * @see SetupPhase#startGame
     * @see TimeLimit
     */
    onGameStarted: 'onGameStarted',

    /**
     * Triggered when a Creature is being healed. If the effect is “up to” a
     * certain amount, will prompt the player to choose how much they want.
     * Removes `'damage'` tokens from the card.
     *
     * Params:
     * * `amount` — A `number` for the amount of damage to heal, if the event is
     *   not `fully`. Starts out already capped by the current amount of damage
     *   on the Creature.
     * * `card` — The {@link Card} for the creature being healed.
     *
     * @see HealAction
     */
    onHeal: 'onHeal',

    /**
     * Triggered when a card has been chosen to be the attacker in a fight. Will
     * lead to either unstunning it or to choosing a defender.
     *
     * Params:
     * * `card` — The `card` that will be attacking.
     *
     * @see FightGameAction
     * @see Smite
     */
    onInitiateFight: 'onInitiateFight',

    /**
     * Triggered when a game effect causes a player to create a token creature.
     * Will convert the card to a Token and put it into play.
     *
     * Params:
     * * `card` — The {@link Card} that will become a token creature. At event
     *   creation this is presumably the top card of the player’s deck.
     * * `player` — The {@link Player} who is making the token creature.
     *
     * @see MakeTokenCreatureAction
     */
    onMakeToken: 'onMakeToken',

    /**
     * Triggered when a player’s æmber amount increases for any reason, such as
     * reaping, stealing, recovering captured `'amber'` tokens, pips on cards,
     * or from card effects that say to “gain Æmber.”
     *
     * Also triggered when a player is instructed explicitly to “lose
     * Æmber,” such as from card effects like Doorstep to Heaven.
     *
     * This is _not_ triggered when a player’s æmber goes down due to forging a
     * key, being stolen from, or having their æmber captured.
     *
     * Params:
     * * `player` — The {@link Player} gaining or losing æmber.
     * * `amount` — The amount for the player to gain or lose. In the case of a
     *   {@link LoseAmberAction}, this starts out being capped to the player’s
     *   current amount of æmber.
     * * `loseAmber` — `true` if this event is triggered by a
     *   {@link LoseAmberAction}.
     * * `reap` — `true` if this event is because of a reap action.
     *
     * @see LoseAmberAction
     * @see ModifyAmberAction
     */
    onModifyAmber: 'onModifyAmber',

    /**
     * Triggered when a player gains chains due to a card effect or raising the
     * tide.
     *
     * Note that despite being called “modify,” this is _not_ triggered when
     * chains are shed during the draw phase.
     *
     * Params:
     * * `player` — The {@link Player} gaining the chains.
     * * `amount` — The `number` of chains being increased.
     *
     * @see ModifyChainsAction
     */
    onModifyBid: 'onModifyBid',

    /**
     * Triggered when a card is moved from one `location` in the game to
     * another, but only if it is not explicitly leaving the `'play area'` (in
     * which case an `onLeavesPlay` event will typically be triggered instead).
     *
     * Also does not trigger if a card from a {@link SearchAction} is moved to
     * hand, or if a card from hand is swapped with the discard by
     * {@link SwapDiscardWithHandAction}.
     *
     * Params:
     * * `card` — The {@link Card} being moved.
     * * `deckLength` — The length of the card’s owner’s deck, if this is from a
     *   {@link ReturnToDeckAction}.
     * * `player` — The {@link Player} for the card’s owner, if this is from a
     *   {@link ReturnToHandAction}.
     *
     * @see MoveCardAction
     * @see ReturnToDeckAction
     * @see ReturnToHandAction
     */
    onMoveCard: 'onMoveCard',

    /**
     * Triggered when a creature is being moved explicitly to a flank of the
     * battleline, or when {@link Pupgrade} converts from an upgrade to flank
     * creature when its target is destroyed.
     *
     * Params:
     * * `card` — The {@link Card} going to a flank.
     *
     * @see MoveToFlankAction
     * @see MoveUpgradeToFlankAction
     */
    onMoveToFlank: 'onMoveToFlank',

    /**
     * Wrapper event to handle discarding cards one at a time, with an event
     * window for each one. Important for when cards with “Scrap:” effects are
     * being discarded so that each can be resolved in turn.
     *
     * Params:
     * * `cards` — An array of {@link Card}s chosen to be discarded. Not all may
     *   actually end up being discarded if they leave the hand for other
     *   reasons before we get around to them.
     * * `discardEvents` — An array of the `onCardDiscarded` events that are
     *   generated / executed to actually discard the cards. Effects can consult
     *   the events of this array to check how many cards actually did get
     *   discarded as a result of them. (_E.g._ Cryptic Collapse) Use the
     *   {@see DiscardCardAction.collectDiscardedCards} helper to get them.
     *
     * @see DiscardCardAction
     */
    onOrderedDiscard: 'onOrderedDiscard',

    /**
     * Triggered when any given game phase is ending. Used for “at the end of
     * your _ step” actions.
     *
     * Params:
     * * `phase` — The `name` of the {@link Phase} that’s ending. (_E.g._
     *   `'main'`, `'house'`)
     *
     * @see Phase#endPhase
     */
    onPhaseEnd: 'onPhaseEnd',

    /**
     * Triggered when any given game phase is starting. Used for “at the start
     * of your _ step” actions, as well as for any cards that are keeping custom
     * track of how many times a thing has happened over the course of a turn.
     *
     * Not triggered if a phase is being _skipped_ due to a card effect.
     *
     * Params:
     * * `phase` — The `name` of the {@link Phase} that’s starting. (_E.g._
     *   `'main'`, `'house'`)
     *
     * @see Phase#startPhase
     */
    onPhaseStarted: 'onPhaseStarted',

    /**
     * Triggered when a card is “placed under” another due to either an explicit
     * card effect (_e.g._ Masterplan) or as part of activating a prophecy.
     *
     * Note that “graft” effects do not trigger `onPlaceUnder` but
     * `onCardGrafted` instead.
     *
     * Params:
     * * - `card` — The {@link Card} that is being placed under another one.
     *
     * @see PlaceUnderAction
     */
    onPlaceUnder: 'onPlaceUnder',

    /**
     * Triggered when an `onActivateProphecy` event has started executing, or
     * any other time that {@link Player#activateProphecy} is explicitly called.
     *
     * `onActivateProphecy` is triggered by the {@link ActivateProphecyAction}
     * and its handler results in choosing a Fate card (if necessary) and moving
     * it. This Event, `onProphecyActivated` is purely a notification from
     * within the {@link Player} object.
     *
     * Note that at this point a Fate card has not necessarily been chosen.
     *
     * Params:
     * * `prophecyCard` — The prophecy {@link Card} being activated.
     *
     * @see Player#activateProphecy
     */
    onProphecyActivated: 'onProphecyActivated',

    /**
     * Triggered when a player’s prophecy card has been “deactivated” due to
     * resolving, flipping, or any other reason.
     *
     * `onDeactivateProphecy` is triggered by the
     * {@link DeactivateProphecyAction} and its handler results in discarding
     * the Fate card. This Event, `onProphecyDeactivated` is purely a
     * notification from within the {@link Player} object.
     *
     * Params:
     * * `prophecyCard` — The prophecy {@link Card} being deactivated.
     *
     * @see Player#deactivateProphecy
     */
    onProphecyDeactivated: 'onProphecyDeactivated',

    /**
     * Triggered as a notification when a prophecy is flipped by
     * {@link Player#flipProphecy}, unlike `onFlipProphecy` which is the
     * {@link Event} for the {@link FlipProphecyAction}.
     *
     * Params:
     * * `prophecyCard` — The {@link Card} for the newly-revealed side of the
     *   prophecy.
     *
     * @see Player#flipProphecy
     */
    onProphecyFlipped: 'onProphecyFlipped',

    /**
     * Triggered when a player chooses to raise the tide or a card effect forces
     * it.
     *
     * Note that if, as this event is executing, the target player’s tide is
     * already high, this will change its name to `unnamedEvent`.
     *
     * Params:
     * * `player` — The {@link Player} whose tide is raising.
     *
     * @see RaiseTideAction
     */
    onRaiseTide: 'onRaiseTide',

    /**
     * Triggered when a Creature is used to reap. If it is not interrupted, will
     * queue an `onModifyAmber` event to actually cause the æmber to be gained.
     *
     * Also creates an `onUseCard` event that will go off regardless of whether
     * or not the reap was successful.
     *
     * Params:
     * * `card` — The {@link Card} being reaped with.
     *
     * @see ResolveReapAction
     */
    onReap: 'onReap',

    /**
     * Triggered when a Creature’s armor is being reduced without explicitly
     * dealing damage to it.
     *
     * Params:
     * * `card` — The {@link Card} whose armor is being reduced.
     * * `amount` — The `number` of armor that should be taken off the card
     *   (until end of turn).
     *
     * @see ReduceArmorAction
     * @see RedhotArmor
     */
    onReduceArmor: 'onReduceArmor',

    /**
     * Triggered when absolutely every counter on a card is being removed by a
     * card effect. Uses {@link RemoveTokenAction} for each one, so
     * `onRemoveToken` events will also fire.
     *
     * Params:
     * * `card` — The {@link Card} losing all of its tokens.
     *
     * @see RemoveAllTokensAction
     * @see FlyingBroomstick
     */
    onRemoveAllTokens: 'onRemoveAllTokens',

    /**
     * Triggered when stun is being removed due to taking an action with a
     * stunned creature, or when a card effect explicitly calls to “unstun” a
     * creature.
     *
     * In the former case, an `onUseCard` event will also be triggered.
     *
     * Params:
     * * `card` — The {@link Card} being un-stunned.
     *
     * @see RemoveStun
     * @see RemoveStunAction
     */
    onRemoveStun: 'onRemoveStun',

    /**
     * Triggered when counters are being removed from a card via
     * {@link RemoveTokenAction} / {@link RemoveAllTokensAction}. If the effect
     * says “up to,” this will prompt the player for an amount to remove.
     *
     * This will _not_ trigger if counters are removed for other reasons (like
     * damage getting healed or a creature being unstunned).
     *
     * Params:
     * * `card` — The {@link Card} having tokens removed.
     * * `type` — The type of token, such as `'power'`, `'scheme'`, or `'ward'`.
     * * `amount` — `number` for the amount of tokens to remove. Is capped at
     *   the current amount of tokens that the card has of that type. If this is
     *   a remove `all` event, the amount of “all” is set when the event is
     *   created and will not change if more tokens are added during
     *   `interrupt` handlers.
     *
     * @see RemoveTokenAction
     */
    onRemoveToken: 'onRemoveToken',

    /**
     * Triggered when a card effect removes a ward or when an `onCardDestroyed`
     * / `onCardPurged` / `onCardLeavesPlay` event is interrupted and replaced
     * by a warded creature. It is not triggered when a ward is removed due to
     * damage.
     *
     * Note that some cards use {@link RemoveTokenAction} to remove a ward token
     * (via `removeWardToken`) and those do not trigger this event. That being
     * said, there are no listeners for either event at the current moment, so
     * the lack of consistency does not lead to any bugs.
     *
     * Params:
     * * `card` — The {@link Card} having its ward removed.
     *
     * @see RemoveWardAction
     */
    onRemoveWard: 'onRemoveWard',

    /**
     * Triggered when the tide is reset to neutral.
     *
     * Params:
     * * `player` — The current {@link Player}.
     *
     * @see ResetTideAction
     * @see TrialByWater
     */
    onResetTide: 'onResetTide',

    /**
     * Triggered when the game rules or a card effect are queuing up an ability
     * to happen. Yeah, it’s that general.
     *
     * Often used directly by cards that have repeating effects.
     *
     * No parameters.
     *
     * @see Game#resolveAbility
     * @see AbilityResolver
     */
    onResolveAbility: 'onResolveAbility',

    /**
     * Triggered when bonus icons are being executed as the result of a card
     * being played. Will prompt the player if any effects allow alternate bonus
     * icon resolution, and will enqueue actions for all of the icons on the card.
     *
     * Params:
     * * `card` — The {@link Card} whose bonus icons are being resolved.
     *
     * @see ResolveBonusIconsAction
     */
    onResolveBonusIcons: 'onResolveBonusIcons',

    /**
     * Triggered when æmber is moved from a creature back to a player’s pool.
     * Will remove `'amber'` tokens without triggering effects for them but will
     * trigger an `onModifyAmber` for the gain.
     *
     * Params:
     * * `card` — The {@link Card} whose æember is being returned.
     * * `amount` — `number` for the amount of æmber to return. Is capped at the
     *   current amount of `'amber'` tokens on the card. If this is an `all`
     *   event, the value for `amount` is determined when the Event is created,
     *   before interrupts go off.
     * * `recipient` — The {@link Player} whose pool the æmber is going into.
     *
     * @see ReturnAmberAction
     */
    onReturnAmber: 'onReturnAmber',

    /**
     * Triggered when a card is revealed from a location.
     *
     * Params:
     * * `card` — The {@link Card} that was revealed.
     *
     * @see RevealAction
     */
    onRevealCards: 'onRevealCards',

    /**
     * Triggered when a player is told to search for one or more cards with a
     * given criteria in a location.
     *
     * Will cause prompts to appear to select cards.
     *
     * Params:
     * * `player` — The {@link Player} whose `location` is the target of the
     *   search.
     * * `location` — The name of the `location` being searched (_e.g._ `'deck'`).
     *
     * @see SearchAction
     */
    onSearch: 'onSearch',

    /**
     * Triggered when æmber is being stolen from a player. Will lead to an
     * `onModifiedAmber` event for the player gaining the æmber, but not
     * additional events for the loser.
     *
     * Params:
     * * `player` — The {@link Player} being stolen from.
     * * `amount` — `number` for the amount of æmber being stolen. Capped at the
     *   target player’s current (at event creation time) amber amount.
     *
     * @see StealAction
     */
    onStealAmber: 'onStealAmber',

    /**
     * Triggered when a card effect stuns a Creature.
     *
     * Params:
     * * `card` — The {@link Card} being stunned.
     *
     * @see StunAction
     */
    onStun: 'onStun',

    /**
     * Triggered to swap two creatures in a battleline. May also lead to tokens
     * and upgrades being swapped among creatures, due to Envoy of Ekwirrĕ’s
     * ability. Because of this, some cards that apply special tokens need to
     * listen to `onSwap` events.
     *
     * Params:
     * * `card` — The chosen creature {@link Card} for the swap (the other card
     *   from the swap is the one whose swap ability activated).
     *
     * @see SwapAction
     */
    onSwap: 'onSwap',

    /**
     * Triggered when a card from hand is swapped with one from the discard pile.
     *
     * Params:
     * * `card` — The {@link Card} in hand.
     *
     * @see SwapDiscardWithHandAction
     */
    onSwapDiscardWithHand: 'onSwapDiscardWithHand', // none

    /**
     * Triggered after a player is given control of a card that was previously
     * their opponent’s. By the time this goes off, the card is already in the
     * new controller’s play area. This is a notification-only event and cannot
     * be meaningfully cancelled.
     *
     * Params:
     * * `card` — The {@link Card} whose control has changed.
     * * `player` — The {@link Player} receiving control of the card.
     *
     * @see Game#finalizeTakeControl
     */
    onTakeControl: 'onTakeControl',

    /**
     * Triggered when æmber is “given” or “paid” from one player to another.
     * Very specifically _not_ a steal.
     *
     * This will lead to an `onModifyAmber` event for the player gaining æmber.
     *
     * Params:
     * * `player` — The {@link Player} losing the æmber.
     * * `amount` — `number` for the amount of amber to be moved. This is capped
     *   at `player`’s current pool size when the event is created.
     *
     * @see TransferAmberAction
     */
    onTransferAmber: 'onTransferAmber',

    /**
     * Triggered at the end of a player’s turn, after all phases have ended,
     * right before declaring check.
     *
     * Listened to for “at the end of your turn” effects.
     *
     * Params:
     * * `player` — The {@link Player} whose turn is ending.
     *
     * @see Game#raiseEndRoundEvent
     */
    onTurnEnd: 'onTurnEnd',

    /**
     * Triggered at the very beginning of a turn, before the forge a key step.
     *
     * Listened to for “at the start of your turn” effects.
     *
     * Params:
     * * `player` — The {@link Player} whose turn is starting.
     *
     * @see Game#beginRound
     */
    onTurnStart: 'onTurnStart',

    /**
     * Triggered when a key is being unforged due to a card effect.
     *
     * Params:
     * * `player` — The {@link Player} whose key is being unforged.
     * * `choices` — Array of key color names (_E.g._ `'red'`) that may be
     *   chosen to unforge. (Used by Key Hammer to limit the unforgable keys to
     *   the ones forged during the previous round.)
     *
     * @see UnforgeAction
     */
    onUnforgeKey: 'onUnforgeKey',

    /**
     * Triggered when an Upgrade is _moved_ from one card to another.
     *
     * Note that this is different from “attach” and therefore is _not_
     * triggered by _e.g._ the blaster actions, which state to
     * “attach” themselves to the new target.
     *
     * Params:
     * * `card` — The {@link Card} for the Upgrade being moved.
     * * `parent` — The new {@link Card} that the upgrade is being put on.
     * * `player` — The {@link Player} provided in the context.
     *
     * @see MoveUpgrade
     */
    onUpgradeMoved: 'onUpgradeMoved',

    /**
     * Triggered after a card is “used” for a reap, fight, action, or to get rid
     * of a stun. This will be triggered even if the underlying action did not
     * succeed, and therefore should be listened to for _e.g._ “after a creature
     * is used to fight”–type effects, which should go off even if circumstances
     * prevented the fight from succeeding.
     *
     * This event is generated from a number of different actions, and has
     * slightly different params from each, though all of them have a `card`
     * which is the {@link Card} that was used.
     *
     * `CardAction` params:
     * * `action`: `true`
     * * `omni`: `boolean` for whether on not this was an Omni effect.
     *
     * `RemoveStun` params:
     * * `unstun`: `true`
     *
     * `ResolveFightAction` params:
     * * `fight`: `true`
     * * `fightEvent`: The {@link Event} for the fight that resulted from this
     *   use of the card.
     *
     * `ResolveReapAction` params:
     * * `reapEvent`: The {@link Event} for the reap that came form this use of the card.
     *
     * @see CardAction
     * @see RemoveStun
     * @see ResolveFightAction
     * @see ResolveReapAction
     */
    onUseCard: 'onUseCard',

    /**
     * Triggered when a creature is being warded via the {@link WardAction}
     * action specifically, which seems to be the most commonly used.
     *
     * Does _not_ get triggered by adding `'ward'` token via
     * {@link AddTokenAction}, used by `addWardToken`.
     *
     * Params:
     * * `card` — The {@link Card} being warded.
     *
     * @see WardAction
     */
    onWard: 'onWard',

    /**
     * Triggered when a card play is started, from any location. This event will
     * prompt for which action on the card should be played.
     *
     * This is at the beginning of the process of playing the card.
     * `onCardPlayed` is the event to listen to for when the card’s effects are
     * actually going to start.
     *
     * @see PlayCardAction
     */
    playCardEvent: 'playCardEvent',

    /**
     * Name for an event that we want to emit for loop-mechanical purposes but
     * is not anything that a card effect would need to listen for.
     *
     * For example, {@link ChangeActiveHouseAction} adds an event whose handler
     * mutates the player object’s active house, but there are (currently) no
     * “when the player’s house changes” triggers on any cards, so it doesn’t
     * need an event name.
     *
     * (Nevertheless, we still use event names for a lot of events that are not
     * currently listened to, for the sake of debugging or potential future card
     * effects.)
     */
    unnamedEvent: 'unnamedEvent'
});

// TODO(fionawhim): Update this to include :preResolution and other sub-event
// labels.
/** @typedef {(typeof EVENTS)[keyof EVENTS]} EventName */

export { EVENTS };
