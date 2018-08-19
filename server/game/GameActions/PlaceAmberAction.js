const CardGameAction = require('./CardGameAction');

class PlaceFateAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        this.name = 'placeAmber';
        this.targetType = ['creature'];
        this.effectMsg = 'place ' + this.amount + ' fate on {0}';
    }

    canAffect(card, context) {
        return this.amount > 0 && card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onPlaceAmber', { card: card, context: context, amount: this.amount }, () => card.addToken('amber', this.amount));
    }
}

module.exports = PlaceFateAction;
