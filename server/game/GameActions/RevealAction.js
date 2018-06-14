const CardGameAction = require('./CardGameAction');

class RevealAction extends CardGameAction {
    setup() {
        super.setup();
        this.name = 'reveal';
        this.effectMsg = 'reveal {0}';
        this.cost = 'revealing {0}';
    }

    canAffect(card, context) {
        if(!card.facedown && card.location !== 'hand') {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onCardRevealed', { card: card, context: context });
    }
}

module.exports = RevealAction;
