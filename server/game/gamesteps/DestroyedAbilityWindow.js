const _ = require('underscore');

const ForcedTriggeredAbilityWindow = require('./forcedtriggeredabilitywindow.js');

class DestroyedTriggeredAbilityWindow extends ForcedTriggeredAbilityWindow {
    constructor(game, abilityType, window, eventsToExclude = []) {
        super(game, abilityType, window, eventsToExclude);
        this.previousChoices = [];
        this.batchedDestroyEvents = [];
        this.batchedLeavesPlayEvents = [];
        this.batchedLeavesPlayEventSet = new Set();
    }

    addChoice(context) {
        // Lock in the initial set of choices so dynamically-granted destroyed:
        // abilities (e.g. Archimedes granting "Destroyed: archive" to its
        // neighbours as the battleline shifts during the window) don't
        // retroactively pick up newly-eligible cards. The exception is
        // contexts triggered by a freshly-batched leavesPlay event (a nested
        // destruction batched into this window mid-resolution) — those have
        // no prior chance to register and must be allowed through.
        const isFreshlyBatchedEvent = this.batchedLeavesPlayEventSet.has(context.event);
        if (
            isFreshlyBatchedEvent ||
            this.previousChoices.length === 0 ||
            this.previousChoices.some(
                (c) => c.ability === context.ability && c.event === context.event
            )
        ) {
            super.addChoice(context);
        }
    }

    addDeferredChoice(context) {
        const isFreshlyBatchedEvent = this.batchedLeavesPlayEventSet.has(context.event);
        if (
            isFreshlyBatchedEvent ||
            this.previousChoices.length === 0 ||
            this.previousChoices.some(
                (c) => c.ability === context.ability && c.event === context.event
            )
        ) {
            super.addDeferredChoice(context);
        }
    }

    resolveAbility(context) {
        // Track that we're resolving a destroyed ability so new destructions can be batched
        this.game.currentDestructionWindow = this;
        super.resolveAbility(context);
        this.previousChoices = this.choices;
    }

    continue() {
        // Make any newly-batched destruction events visible to emitEvents so
        // their Destroyed: triggers get queued as additional choices in this
        // same window (instead of auto-resolving in their own nested window).
        // This is what lets nested triggers — e.g. Kaspara granting Shadys
        // "Destroyed: each player gains 1A" — be ordered alongside the rest
        // of the destruction batch.
        this.captureNewlyBatchedLeavesPlayEvents();
        const result = super.continue();
        if (result) {
            this.game.currentDestructionWindow = null;
            this.processBatchedDestroyEvents();
        }
        return result;
    }

    /**
     * Override so emitEvents fires onCardLeavesPlay:interrupt for any nested
     * leavesPlay events batched into this window mid-resolution, in addition
     * to the events already on the parent EventWindow's chain. We deliberately
     * DON'T splice these onto the parent chain — doing so would cause the
     * outer EventWindow's executeHandler/reaction pipeline phases to re-run
     * those events, double-processing them.
     */
    emitEvents() {
        this.choices = [];
        let events = _.difference(
            this.eventWindow.event.getSimultaneousEvents(),
            this.eventsToExclude
        );
        events = events.concat(this.batchedLeavesPlayEvents.filter((event) => !event.cancelled));
        _.each(events, (event) => {
            this.game.emit(event.name + ':' + this.abilityType, event, this);
        });
    }

    /**
     * Add a destruction event from a destroyed ability to be batched with the
     * current destruction events. The event will be processed after all
     * destroyed abilities resolve.
     */
    addBatchedDestroyEvent(destroyEvent) {
        this.batchedDestroyEvents.push(destroyEvent);
    }

    captureNewlyBatchedLeavesPlayEvents() {
        for (const destroyEvent of this.batchedDestroyEvents) {
            const leavesPlayEvent = destroyEvent.leavesPlayEvent;
            if (!leavesPlayEvent || this.batchedLeavesPlayEventSet.has(leavesPlayEvent)) {
                continue;
            }
            this.batchedLeavesPlayEvents.push(leavesPlayEvent);
            this.batchedLeavesPlayEventSet.add(leavesPlayEvent);
        }
    }

    /**
     * Move every batched card to discard now that the destruction window has
     * fully resolved. Skips events cancelled by replacement effects ("instead")
     * or whose leavesPlay condition no longer holds. Also adds each
     * destruction event onto the parent destroyed event so the reaction
     * window covers them all in one batch.
     */
    processBatchedDestroyEvents() {
        if (this.batchedDestroyEvents.length === 0) {
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
            if (
                leavesPlayEvent &&
                !leavesPlayEvent.cancelled &&
                leavesPlayEvent.condition(leavesPlayEvent)
            ) {
                destroyEvent.card.owner.moveCard(destroyEvent.card, 'discard');
            }
        }

        this.batchedDestroyEvents = [];
    }
}

module.exports = DestroyedTriggeredAbilityWindow;
