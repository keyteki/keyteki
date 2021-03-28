const CardGameAction = require('./CardGameAction');

class ReturnToHandAction extends CardGameAction {
    setDefaultProperties() {
        this.location = ['play area'];
    }

    setup() {
        super.setup();
        this.name = 'returnToHand';
        this.effectMsg = 'return {0} to their hand';
        this.cost = "returning {0} to their owner's hand";

        if (!Array.isArray(this.location)) {
            this.location = [this.location];
        }
    }

    canAffect(card, context) {
        if (!this.location.includes(card.location)) {
            return false;
        }

        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let eventName = card.location === 'play area' ? 'onCardLeavesPlay' : 'onMoveCard';

        return super.createEvent(
            eventName,
            { card: card, player: card.owner, context: context },
            (event) => event.player.moveCard(event.card, 'hand')
        );
    }
}

module.exports = ReturnToHandAction;
