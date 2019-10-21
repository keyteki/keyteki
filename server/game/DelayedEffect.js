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
        this.multipleTrigger = properties.multipleTrigger;
    }

    checkEffect(events) {
        let matchingEvents = events.filter(event => this.when[event.name]);
        if(matchingEvents.length > 0) {
            if(!this.multipleTrigger) {
                let event = matchingEvents.find(event => this.when[event.name](event));
                if(event) {
                    this.game.effectEngine.removeDelayedEffect(this);
                    this.executeHandler(event);
                }
            } else {
                for(let event of matchingEvents.filter(event => this.when[event.name](event))) {
                    this.executeHandler(event);
                }
            }
        }
    }

    executeHandler(event) {
        if(this.handler) {
            this.handler(event);
            return;
        }

        if(this.message) {
            this.game.addMessage(this.message, this.context.player, this.source, this.target || event.card);
        }

        let context = this.context.copy();
        context.event = event;
        if(this.gameAction) {
            this.gameAction.resolve(this.target || event.card, context);
        }
    }

    getDebugInfo() {
        return {
            source: this.source && this.source.name,
            target: this.target && this.target.name
        };
    }
}

module.exports = DelayedEffect;
