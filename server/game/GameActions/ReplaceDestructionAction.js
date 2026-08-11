const { EVENTS } = require('../Events/types');
const GameAction = require('./GameAction');

/**
 * Registers a destruction replacement for the current card.
 *
 * When used inside a `destroyed()` ability, this action:
 *   1. Marks the destroy event as "replaced" so cancellation is deferred.
 *   2. Stores the inner `gameAction` array on the DestroyedAbilityWindow
 *      for deferred execution after all destroyed abilities resolve.
 *
 * The actual replacement actions (heal, exhaust, etc.) execute at
 * "replacement time" — after every destroyed ability has resolved but
 * before events are cancelled and cards move to discard. This ensures
 * correct ordering: other destroyed abilities see the original board state.
 */
class ReplaceDestructionAction extends GameAction {
    setDefaultProperties() {
        this.gameAction = [];
        this.event = null; // Optional: override for the leavesPlay event (needed in `then` blocks)
    }

    setup() {
        this.name = 'replaceDestruction';
        this.targetType = [];
    }

    setDefaultTarget(func) {
        for (let action of this.gameAction) {
            action.setDefaultTarget(func);
        }
    }

    setTarget(target) {
        for (let action of this.gameAction) {
            action.setTarget(target);
        }
    }

    update(context) {
        super.update(context);
        if (!Array.isArray(this.gameAction)) {
            this.gameAction = [this.gameAction];
        }
        for (let action of this.gameAction) {
            action.update(context);
        }
    }

    preEventHandler(context) {
        this.update(context);
        for (let action of this.gameAction) {
            action.preEventHandler(context);
        }
    }

    hasLegalTarget(context) {
        this.update(context);
        return true;
    }

    canAffect(target, context) {
        return this.gameAction.some((action) => action.canAffect(target, context));
    }

    getEventArray(context) {
        // Determine the leavesPlay event — either explicitly passed (for
        // `then` blocks) or from the ability context.
        const leavesPlayEvent = this.event || context.event;

        // Single event that marks the destruction as replaced and stores
        // the pending replacement actions for deferred execution.
        return [
            super.createEvent(EVENTS.unnamedEvent, {}, () => {
                if (leavesPlayEvent) {
                    leavesPlayEvent.replacedByAction = true;
                    const destroyEvent = leavesPlayEvent.triggeringEvent;
                    if (destroyEvent) {
                        destroyEvent.replaced = true;
                        // Clear damage/fight flags so "destroyed this way"
                        // checks (e.g. Throwing Stars) exclude replaced cards.
                        destroyEvent.destroyedByDamageDealt = false;
                        destroyEvent.destroyedFighting = false;
                    }
                }

                // Store the pending replacement on the destruction window
                // for deferred execution after all abilities resolve.
                const window = context.game.currentDestructionWindow;
                if (window) {
                    window.pendingReplacements.push({
                        actions: this.gameAction,
                        context: context,
                        leavesPlayEvent: leavesPlayEvent
                    });
                }
            })
        ];
    }
}

module.exports = ReplaceDestructionAction;
