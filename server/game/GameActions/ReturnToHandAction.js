const CardGameAction = require('./CardGameAction');

class ReturnToHandAction extends CardGameAction {
    setDefaultProperties() {
        this.location = 'play area';
    }

    setup() {
        super.setup();
        this.name = 'returnToHand';
        this.effectMsg = 'return {0} to their hand';
        this.cost = 'returning {0} to their owner\'s hand';
    }

    canAffect(card, context) {
        if(card.location !== this.location) {
            return false;
        }

        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        if(this.location === 'play area') {
            return super.createEvent('onCardLeavesPlay', { card: card, context: context }, () => card.owner.moveCard(card, 'hand'));
        }

        return super.createEvent('onMoveCard', { card: card, context: context }, () => card.owner.moveCard(card, 'hand'));
    }
}

module.exports = ReturnToHandAction;
