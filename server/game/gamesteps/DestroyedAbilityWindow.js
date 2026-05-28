const _ = require('underscore');

const ForcedTriggeredAbilityWindow = require('./forcedtriggeredabilitywindow.js');

/**
 * Specialised triggered-ability window for `Destroyed:` abilities.
 *
 * KeyForge has two strict semantics that this window enforces and that
 * neither the base ForcedTriggeredAbilityWindow nor the EventWindow
 * pipeline gives us for free:
 *
 *   1. **Cascade tagging within a single window.**
 *      When a `Destroyed:` ability tags more creatures for destruction
 *      (e.g. Soulkeeper "Destroyed: destroy the most powerful enemy
 *      creature"), those cascaded destructions must NOT open a separate
 *      destruction window. They are batched into the current window so
 *      the active player gets a single ordering prompt across the
 *      entire cascade, and every card tagged for destruction stays on
 *      the board until the whole batch resolves. The actual
 *      "place into discard pile" happens once at the very end via
 *      `discardAllTaggedCards()`.
 *
 *   2. **Lock-in of each card's `Destroyed:` ability set at tagging time.**
 *      A card only resolves `Destroyed:` abilities that it had at
 *      the moment it was tagged for destruction. Anything
 *      that becomes eligible later must NOT retroactively trigger.
 *
 * The two semantics interact: cascaded destructions are tagged
 * mid-window, and their *initial* triggers (the abilities the card had
 * the moment it was tagged) must be allowed through the lock-in exactly
 * once — but no later eligibility changes for those events should slip
 * through.
 */
class DestroyedTriggeredAbilityWindow extends ForcedTriggeredAbilityWindow {
    constructor(game, abilityType, window, eventsToExclude = []) {
        super(game, abilityType, window, eventsToExclude);
        // Cascaded destroy events queued by DestroyAction while this
        // window is the active destruction window. Drained at window
        // close (`discardAllTaggedCards`): cards are placed into their
        // owner's discard pile and each event is attached as a child of
        // the parent destroyed event so the outer EventWindow's reaction
        // phase covers the whole cascade in one pass.
        this.batchedDestroyEvents = new Set();
        // The leavesPlay sub-events for those cascaded destructions.
        // Re-emitted by our `emitEvents()` override so their
        // `Destroyed:` triggers register as additional orderable choices
        // in this window.
        this.batchedLeavesPlayEvents = new Set();
        // The subset of `batchedLeavesPlayEvents` just added and not yet
        // emitted. The lock-in check in `addChoice` / `addDeferredChoice`
        // bypasses `lockedInChoices` only for events in this set, so the
        // initial trigger set of a newly-tagged card can register;
        // `continue()` clears it after `super.continue()` runs
        // `emitEvents()` once, locking the trigger list in. This is what
        // implements the "abilities at the time the card was tagged"
        // rule for cascaded destructions, and prevents a later
        // persistent-effect change (e.g. Thoughtcatcher's grant becoming
        // eligible because a tagged creature gained amber mid-window)
        // from retroactively adding a new trigger to an already-emitted
        // event.
        this.newlyTaggedLeavesPlayEvents = new Set();
        // Snapshot of `this.choices` taken after each ability resolution.
        // Used by addChoice/addDeferredChoice to reject contexts that
        // weren't part of the original (or newly-tagged) trigger set —
        // i.e. abilities the card didn't have at tagging time.
        this.lockedInChoices = [];
    }

    addChoice(context) {
        // Lock-in rule: once we've seen the initial trigger set for an
        // event, only re-accept (ability, event) pairs that were already
        // present. This prevents dynamically-granted `Destroyed:`
        // abilities from picking up tagged cards that didn't have those
        // abilities at tagging time.
        //
        // Exception: if this context's event is a newly-tagged cascaded
        // leavesPlay event that hasn't been emitted before, its triggers
        // have had no prior chance to register and must be allowed
        // through. After the next super.continue() call the event is
        // removed from the newly-tagged set, locking its trigger list in.
        const isNewlyTaggedEvent = this.newlyTaggedLeavesPlayEvents.has(context.event);
        if (
            isNewlyTaggedEvent ||
            this.lockedInChoices.length === 0 ||
            this.lockedInChoices.some(
                (c) => c.ability === context.ability && c.event === context.event
            )
        ) {
            super.addChoice(context);
        }
    }

    addDeferredChoice(context) {
        // Mirror addChoice's lock-in rule for deferred (condition not yet
        // met) choices. Without this, a deferred trigger granted
        // mid-window could become non-deferred on a later iteration and
        // sneak past the snapshot.
        const isNewlyTaggedEvent = this.newlyTaggedLeavesPlayEvents.has(context.event);
        if (
            isNewlyTaggedEvent ||
            this.lockedInChoices.length === 0 ||
            this.lockedInChoices.some(
                (c) => c.ability === context.ability && c.event === context.event
            )
        ) {
            super.addDeferredChoice(context);
        }
    }

    resolveAbility(context) {
        // Mark this window as the currently-open destruction window so
        // DestroyAction can detect cascaded destructions and route them
        // into addBatchedDestroyEvent instead of opening a new
        // DestroyedAbilityWindow / moving the card to discard immediately.
        this.game.currentDestructionWindow = this;
        super.resolveAbility(context);
        // Snapshot the choice set we just resolved against. Future
        // iterations use this to reject new `Destroyed:` abilities on
        // cards already tagged for destruction.
        this.lockedInChoices = this.choices;
    }

    continue() {
        // Promote any destroy events that DestroyAction queued onto us
        // since the last iteration into leavesPlay events that
        // emitEvents() will re-emit. New entries land in
        // newlyTaggedLeavesPlayEvents so their triggers can bypass the
        // lock-in exactly once.
        //
        // This is what lets cascade triggers — e.g. Kaspara granting
        // Shadys "Destroyed: each player gains 1A" when Shadys is killed
        // by another card's `Destroyed:` ability — be queued as
        // additional orderable choices in the same window instead of
        // auto-resolving inside a nested window.
        this.captureNewlyTaggedLeavesPlayEvents();
        const result = super.continue();
        // super.continue() ran emitEvents() (which fires the destroyed:
        // event for every cascaded leavesPlay event) and gathered
        // choices for them. Those events are no longer "newly tagged" —
        // any future iteration must lock in the choices collected here
        // and reject newly-eligible abilities. Clear the set
        // unconditionally so that even if super.continue() returns true
        // (window finishing) and the window is somehow re-entered, the
        // lock-in still applies.
        this.newlyTaggedLeavesPlayEvents.clear();
        if (result) {
            // Window is closing. Release the destruction-window flag
            // before discarding tagged cards so any further destruction
            // triggered by post-window cleanup opens its own window
            // normally.
            this.game.currentDestructionWindow = null;
            this.discardAllTaggedCards();
        }
        return result;
    }

    /**
     * Override of ForcedTriggeredAbilityWindow.emitEvents that ALSO emits
     * destroyed:interrupt for any cascaded leavesPlay events tagged into
     * this window mid-resolution.
     *
     * We deliberately do NOT splice the cascaded events onto the parent
     * EventWindow's chain. Doing so would cause the outer EventWindow's
     * executeHandler / reaction pipeline phases to re-process those
     * events, which would (a) double-fire reactions, and (b) attempt to
     * move the cards to discard a second time. The cascaded events are
     * instead processed atomically in `discardAllTaggedCards()` once
     * the destruction window completes.
     */
    emitEvents() {
        this.choices = [];
        const events = _.difference(
            this.eventWindow.event.getSimultaneousEvents(),
            this.eventsToExclude
        );
        for (const event of this.batchedLeavesPlayEvents) {
            if (!event.cancelled) {
                events.push(event);
            }
        }
        _.each(events, (event) => {
            this.game.emit(event.name + ':' + this.abilityType, event, this);
        });
    }

    /**
     * Called by DestroyAction when it detects an open destruction window
     * (`game.currentDestructionWindow`). Tags the destroy event onto
     * this window's cascade instead of letting it open its own
     * DestroyedAbilityWindow / moving the card to discard immediately.
     * The card stays in `play area` with `moribund = true` (i.e.
     * "tagged for destruction") until the outer window's
     * `discardAllTaggedCards` runs at close.
     */
    addBatchedDestroyEvent(destroyEvent) {
        this.batchedDestroyEvents.add(destroyEvent);
    }

    /**
     * Promote each newly-tagged destroy event's leavesPlay sub-event
     * into our re-emit set. New entries are also added to
     * `newlyTaggedLeavesPlayEvents` so their initial triggers can bypass
     * the lock-in check exactly once on the next emit pass.
     * `batchedLeavesPlayEvents` is a Set, so re-running this across
     * multiple `continue()` passes never re-emits the same event twice.
     */
    captureNewlyTaggedLeavesPlayEvents() {
        for (const destroyEvent of this.batchedDestroyEvents) {
            const leavesPlayEvent = destroyEvent.leavesPlayEvent;
            if (!leavesPlayEvent || this.batchedLeavesPlayEvents.has(leavesPlayEvent)) {
                continue;
            }
            this.batchedLeavesPlayEvents.add(leavesPlayEvent);
            this.newlyTaggedLeavesPlayEvents.add(leavesPlayEvent);
        }
    }

    /**
     * Place every tagged card into its owner's discard pile now that the
     * destruction window has fully resolved. Per the rulebook, all
     * tagged cards are placed in their owners' discard piles after every
     * `Destroyed:` ability has resolved. Runs exactly once, when
     * `continue()` returns true (after the choice queue is empty and
     * `pressedDone` is set, or there were never any choices to begin
     * with).
     *
     * Behaviour:
     *   - Skips events cancelled by an "instead" replacement effect —
     *     per the rulebook, the only way for a tag to be removed.
     *     Effects that heal a tagged creature, apply ward to it, or
     *     otherwise modify it do NOT remove the tag and do NOT prevent
     *     the discard.
     *   - Re-checks each leavesPlay event's `condition`
     *     (`card.location === 'play area'`) so abilities that moved the
     *     card to a different out-of-play zone mid-window (e.g.
     *     archive, hand) properly suppress the move-to-discard. The
     *     card is still considered "destroyed" for trigger purposes —
     *     we just don't double-move it.
     *   - Adds each destroy event as a child of the parent destroyed
     *     event so the outer EventWindow's reaction phase covers them
     *     all together — this is what gives reactions like "after a
     *     creature is destroyed" a single grouped trigger across the
     *     whole cascade rather than one per cascaded destruction.
     */
    discardAllTaggedCards() {
        if (this.batchedDestroyEvents.size === 0) {
            return;
        }

        const leavesPlayEvents = this.eventWindow.event.getSimultaneousEvents();
        const parentDestroyedEvent =
            leavesPlayEvents.length > 0 ? leavesPlayEvents[0].triggeringEvent : null;

        for (const destroyEvent of this.batchedDestroyEvents) {
            // Skip events cancelled by an "instead" replacement effect.
            if (destroyEvent.cancelled) {
                continue;
            }
            if (parentDestroyedEvent) {
                parentDestroyedEvent.addChildEvent(destroyEvent);
            }
            const leavesPlayEvent = destroyEvent.leavesPlayEvent;
            // Re-check the leavesPlay condition (location === 'play area')
            // so an ability that moved the card to a different
            // out-of-play zone mid-window doesn't get its discard
            // double-applied here.
            if (
                leavesPlayEvent &&
                !leavesPlayEvent.cancelled &&
                leavesPlayEvent.condition(leavesPlayEvent)
            ) {
                destroyEvent.card.owner.moveCard(destroyEvent.card, 'discard');
            }
        }

        this.batchedDestroyEvents.clear();
    }
}

module.exports = DestroyedTriggeredAbilityWindow;
