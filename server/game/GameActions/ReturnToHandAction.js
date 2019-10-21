const CardGameAction = require('./CardGameAction');

class ReturnToHandAction extends CardGameAction {
    setDefaultProperties() {
        this.location = 'play area';
        this.moveUpgrade = false;
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
        let eventName = (this.location === 'play area') ? 'onCardLeavesPlay' : 'onMoveCard';

        return super.createEvent(eventName, { card: card, player: card.owner, context: context }, event => event.player.moveCard(event.card, 'hand', { moveUpgrade: this.moveUpgrade }));
    }
}

module.exports = ReturnToHandAction;
