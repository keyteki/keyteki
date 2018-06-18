const CardGameAction = require('./CardGameAction');
const LeavesPlayEvent = require('../Events/LeavesPlayEvent');

class DiscardFromPlayAction extends CardGameAction {
    constructor(propertyFactory, isSacrifice = false) {
        super(propertyFactory);
        this.name = isSacrifice ? 'sacrifice' : 'discardFromPlay';
        this.effectMsg = isSacrifice ? 'sacrifice {0}' : 'discard {0}';
        this.cost = 'sacrificing {0}';
    }

    setup() {
        this.targetType = ['character', 'attachment', 'holding'];
    }

    canAffect(card, context) {
        if(card.type === 'holding') {
            if(!card.location.includes('province')) {
                return false;
            }
        } else if(card.location !== 'play area') {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return new LeavesPlayEvent({ context: context }, card, this);
    }
}

module.exports = DiscardFromPlayAction;
