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
        this.getEventsFunc = properties.getEvents;
    }

    getEvents() {
        if(this.message) {
            this.game.addMessage(this.message, this.source, this.target);
        }
        if(this.getEventsFunc) {
            return this.getEventsFunc();
        } else if(this.gameAction) {
            return this.game.getEventsForGameAction(this.gameAction, this.target, this.context)[0];
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
