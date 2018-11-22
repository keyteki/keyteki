/**
 * Represents a terminal condition applied by a card effect.
 *
 * Properties:
 * target           - card to which this effect has been applied
 * context          - context of the ability which generated the effect
 * condition        - function which should return true when the card is to be removed from play
 * gameAction       - gameAction to apply to target
 * message          - message to be displayed in chat with {0} as the source of the effect
 *                    and {1} as the target
 * getEvents        - an optional function which passes events which should be resolved when
 *                    the terminal condtion triggers
 */

class TerminalCondition {
    constructor(game, source, properties) {
        this.game = game;
        this.source = source;
        this.target = properties.target;
        this.context = properties.context;
        this.condition = properties.condition || (() => true);
        this.gameAction = properties.gameAction;
        this.message = properties.message;
        this.getEventFunc = properties.getEvent;
        this.event = null;
    }

    checkCondition() {
        return this.condition() && (!this.event || this.event.cancelled);
    }

    getEvent() {
        if(this.message) {
            this.game.addMessage(this.message, this.source, this.target);
        }
        if(this.getEventFunc) {
            return this.getEventFunc();
        } else if(this.gameAction) {
            this.event = this.gameAction.getEvent(this.target, this.context);
            return this.event;
        }
    }

    getDebugInfo() {
        return {
            source: this.source.name,
            target: this.target.name
        };
    }
}

module.exports = TerminalCondition;
