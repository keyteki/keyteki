/**
 * Represents a delayed card based effect.
 *
 * Properties:
 * target           - card to which this effect has been applied
 * context          - context of the ability which generated the effect
 * when             - object with event names as keys and conditions as values
 * gameAction       - gameAction to apply to target
 * message          - message to be displayed in chat with {0} as the source of the effect
 *                    and {1} as the target
 * handler          - a function which resolves the effect.  Can be omited if a gameAction
 *                    is present
 */

class DelayedEffect {
    constructor(game, source, properties) {
        this.game = game;
        this.source = source;
        this.target = properties.target;
        this.context = properties.context;
        this.when = properties.when;
        this.gameAction = properties.gameAction;
        this.message = properties.message;
        this.handler = properties.handler;
    }

    checkEffect(events) {
        let matchingEvents = events.filter(event => this.when[event.name]);
        if(matchingEvents.length > 0) {
            if(matchingEvents.some(event => event.name !== 'onCheckGameState')) {
                this.game.effectEngine.removeDelayedEffect(this);
            }
            return matchingEvents.some(event => this.when[event.name](event));
        }
        return false;
    }

    executeHandler(event) {
        if(this.handler) {
            this.handler(event);
            return;
        }
        if(this.message) {
            this.game.addMessage(this.message, this.source, this.target);
        }
        if(this.gameAction && this.target && (!this.event || this.event.cancelled)) {
            this.event = this.game.applyGameAction(this.context, { [this.gameAction]: this.target })[0];
        }
    }
}

module.exports = DelayedEffect;
