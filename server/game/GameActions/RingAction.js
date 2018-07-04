const _ = require('underscore');
const GameAction = require('./GameAction');

class RingAction extends GameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.promptForSelect = null;
    }

    setup() {
        this.targetType = ['ring'];
    }

    hasLegalTarget(context) {
        let result = super.hasLegalTarget(context);
        if(this.promptForSelect) {
            return _.any(context.game.rings, ring => (
                this.canAffect(ring, context) &&
                (!this.promptForSelect.ringCondition || this.promptForSelect.ringCondition(ring, context))
            ));
        }
        return result;
    }

    preEventHandler(context) {
        super.preEventHandler(context);
        if(this.promptForSelect) {
            let properties = _.omit(this.promptForSelect, 'ringCondition');
            if(this.promptForSelect.ringCondition) {
                properties.ringCondition = ring => this.canAffect(ring, context) && this.promptForSelect.ringCondition(ring, context);
            }
            let defaultProperties = {
                player: context.player,
                context: context,
                ringCondition: ring => this.canAffect(ring, context),
                onSelect: (player, ring) => {
                    this.setTarget(ring);
                    if(this.promptForSelect.message) {
                        let messageArgs = this.promptForSelect.messageArgs || [];
                        if(typeof messageArgs === 'function') {
                            messageArgs = messageArgs(this);
                        }
                        if(!Array.isArray(messageArgs)) {
                            messageArgs = [messageArgs];
                        }
                        context.game.addMessage(this.promptForSelect.message, ...messageArgs);
                    }
                    return true;
                }
            };
            properties = Object.assign(defaultProperties, properties);
            context.game.promptForRingSelect(properties.player, properties);
        }
    }

    defaultTargets(context) {
        if(context.game.currentConflict) {
            return context.game.currentConflict.ring;
        }
    }

    checkEventCondition(event) {
        return this.canAffect(event.ring, event.context);
    }
}

module.exports = RingAction;
