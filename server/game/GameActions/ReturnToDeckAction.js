const CardGameAction = require('./CardGameAction');
const LeavesPlayEvent = require('../Events/LeavesPlayEvent');

class ReturnToDeckAction extends CardGameAction {
    setDefaultProperties() {
        this.bottom = false;
        this.shuffle = false;
    }
    setup() {
        this.name = 'returnToDeck';
        this.targetType = ['character', 'attachment'];
        this.effectMsg = 'return {0} to the ' + (this.bottom ? 'bottom' : 'top') + ' of their deck';
    }

    canAffect(card, context) {
        if(card.location !== 'play area') {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let destination = card.isDynasty ? 'dynasty deck' : 'conflict deck';
        return new LeavesPlayEvent({ context: context, destination: destination, options: { bottom: this.bottom, shuffle: this.shuffle } }, card, this);
    }
}

module.exports = ReturnToDeckAction;
