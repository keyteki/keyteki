const ForcedTriggeredAbilityWindow = require('./forcedtriggeredabilitywindow.js');

/**
 * Specialised triggered-ability window for `Destroyed:` abilities.
 *
 * Enforces two semantics the base classes don't provide:
 *
 *   1. **Cascade batching** — cascaded destructions (e.g. Soulkeeper
 *      destroying another creature) are batched into this window rather
 *      than opening a nested one. All tagged cards stay on the board
 *      until `discardAllTaggedCards()` runs at window close.
 *
 *   2. **Ability lock-in** — a card only resolves `Destroyed:` abilities
 *      it had when tagged. Abilities gained after tagging are rejected.
 *
 * These interact: cascaded cards are tagged mid-window and their initial
 * triggers must bypass the lock-in exactly once.
 */
class DestroyedTriggeredAbilityWindow extends ForcedTriggeredAbilityWindow {
    constructor(game, abilityType, window, eventsToExclude = []) {
        super(game, abilityType, window, eventsToExclude);
        // Cascaded destroy events queued by DestroyAction while this
        // window is active. Processed in `discardAllTaggedCards()`.
        this.batchedDestroyEvents = new Set();
        // LeavesPlay sub-events for cascaded destructions, re-emitted
        // by `emitEvents()` so their triggers register as choices.
        this.batchedLeavesPlayEvents = new Set();
        // Subset of batchedLeavesPlayEvents not yet emitted. addChoice
        // bypasses the lock-in for these so initial triggers can register
        // once; cleared after emitEvents() runs.
        this.newlyTaggedLeavesPlayEvents = new Set();
        // Snapshot of choices after each resolution. addChoice rejects
        // any (ability, event) pair not in this set.
        this.lockedInChoices = [];
    }

    addChoice(context) {
        // Only accept (ability, event) pairs already in the locked-in set,
        // unless this event was just tagged and hasn't been emitted yet.
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
        // Same lock-in rule as addChoice, for deferred triggers.
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
        // Flag so DestroyAction batches cascaded destructions into us.
        this.game.currentDestructionWindow = this;
        super.resolveAbility(context);
        // Lock in choices — future emits reject anything not in this set.
        this.lockedInChoices = this.choices;
    }

    continue() {
        // Promote newly-batched destroy events so emitEvents() covers them.
        this.captureNewlyTaggedLeavesPlayEvents();
        const result = super.continue();
        // After emitting, these events are no longer "newly tagged" —
        // future iterations enforce the lock-in.
        this.newlyTaggedLeavesPlayEvents.clear();
        if (result) {
            this.game.currentDestructionWindow = null;
            this.discardAllTaggedCards();
        }
        return result;
    }

    // Extends the base emitEvents to also emit for batched cascaded
    // leavesPlay events. These are NOT spliced onto the parent EventWindow
    // (which would double-fire reactions); they're handled atomically in
    // discardAllTaggedCards().
    emitEvents() {
        this.choices = [];
        const events = this.eventWindow.event
            .getSimultaneousEvents()
            .filter((e) => !this.eventsToExclude.includes(e));
        for (const event of this.batchedLeavesPlayEvents) {
            if (!event.cancelled) {
                events.push(event);
            }
        }
        for (const event of events) {
            this.game.emit(event.name + ':' + this.abilityType, event, this);
        }
    }

    // Called by DestroyAction to batch a cascaded destruction into this
    // window. The card stays in play (tagged for destruction) until discardAllTaggedCards.
    addBatchedDestroyEvent(destroyEvent) {
        this.batchedDestroyEvents.add(destroyEvent);
    }

    // Promote each batched destroy event's leavesPlay sub-event into the
    // re-emit set. Uses Sets to avoid re-promoting across continue() passes.
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

    // Move all tagged cards to discard now that abilities have resolved.
    // Skips cancelled events (replacement effects) and cards already moved
    // out of play mid-window. Attaches each destroy event as a child of
    // the parent so the outer EventWindow's reaction phase sees the full
    // cascade as one grouped trigger.
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
            // Skip if card was already moved out of play mid-window.
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
