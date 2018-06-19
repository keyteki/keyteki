const CardGameAction = require('./CardGameAction');

class RevealAction extends CardGameAction {
    setup() {
        super.setup();
        this.name = 'reveal';
        this.effectMsg = 'reveal {0}';
        this.cost = 'revealing {0}';
    }

    canAffect(card, context) {
        let testLocations = ['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province','play area'];
        if(!card.facedown && testLocations.includes(card.location)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onCardRevealed', { card: card, context: context });
    }
}

module.exports = RevealAction;
