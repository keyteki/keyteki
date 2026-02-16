const ForcedTriggeredAbilityWindow = require('./forcedtriggeredabilitywindow.js');

class DestroyedTriggeredAbilityWindow extends ForcedTriggeredAbilityWindow {
    constructor(game, abilityType, window, eventsToExclude = []) {
        super(game, abilityType, window, eventsToExclude);
        this.previousChoices = [];
        this.batchedDestroyEvents = [];
    }

    addChoice(context) {
        if (
            this.previousChoices.length === 0 ||
            this.previousChoices.some(
                (c) => c.ability === context.ability && c.event === context.event
            )
        ) {
            super.addChoice(context);
        }
    }

    resolveAbility(context) {
        // Track that we're resolving a destroyed ability so new destructions can be batched
        this.game.currentDestructionWindow = this;
        super.resolveAbility(context);
        this.previousChoices = this.choices;
    }

    continue() {
        const result = super.continue();
        // When we're done with this window, clear tracking and process batched events
        if (result) {
            this.game.currentDestructionWindow = null;
            this.processBatchedDestroyEvents();
        }
        return result;
    }

    /**
     * Add a destruction event from a destroyed ability to be batched with the
     * current destruction events. The event will be processed after all destroyed
     * abilities resolve.
     */
    addBatchedDestroyEvent(destroyEvent) {
        this.batchedDestroyEvents.push(destroyEvent);
    }

    /**
     * Process all batched destruction events by adding them to the parent
     * onCardDestroyed event batch so they share the same reaction window.
     */
    processBatchedDestroyEvents() {
        if (this.batchedDestroyEvents.length === 0) {
            return;
        }

        // Find the parent onCardDestroyed event
        // The eventWindow.event contains onCardLeavesPlay events, and their
        // triggeringEvent is the onCardDestroyed event we want to add to
        const leavesPlayEvents = this.eventWindow.event.getSimultaneousEvents();
        if (leavesPlayEvents.length > 0 && leavesPlayEvents[0].triggeringEvent) {
            const parentDestroyedEvent = leavesPlayEvents[0].triggeringEvent;

            for (const destroyEvent of this.batchedDestroyEvents) {
                // Skip cancelled events - they were prevented by an "instead" ability
                if (destroyEvent.cancelled) {
                    continue;
                }

                // Add this destruction event as a child of the parent destroyed event
                // This makes them share the same reaction window
                parentDestroyedEvent.addChildEvent(destroyEvent);
            }
        }

        this.batchedDestroyEvents = [];
    }
}

module.exports = DestroyedTriggeredAbilityWindow;
