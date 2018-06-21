const CardGameAction = require('./CardGameAction');
const MoveFateEvent = require('../Events/MoveFateEvent');

class PlaceFateAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = 1;
        this.origin = null;
    }

    setup() {
        this.name = 'placeFate';
        this.targetType = ['character'];
        this.effectMsg = 'place ' + this.amount + ' fate on {0}';
    }

    canAffect(card, context) {
        if(this.amount === 0 || card.location !== 'play area' || card.type !== 'character') {
            return false;
        }
        return super.canAffect(card, context) && this.checkOrigin(context);
    }

    checkOrigin(context) {
        if(this.origin) {
            if(this.origin.fate === 0) {
                return false;
            } else if(['player', 'ring'].includes(this.origin.type)) {
                return true;
            }
            return this.origin.allowGameAction('removeFate', context);
        }
        return true;
    }

    checkEventCondition(event) {
        return this.canAffect(event.recipient, event.context);
    }

    getEvent(card, context) {
        return new MoveFateEvent({ context: context }, this.amount, this.origin, card, this);
    }
}

module.exports = PlaceFateAction;
