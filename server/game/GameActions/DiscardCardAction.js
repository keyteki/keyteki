const CardGameAction = require('./CardGameAction');

class DiscardCardAction extends CardGameAction {
    setup() {
        super.setup();
        this.name = 'discard';
        this.effectMsg = 'discard {0}';
        this.cost = 'discarding {0}';
    }

    getEvent(card, context) {
        return super.createEvent('onCardDiscarded', { card, context }, () => {
            card.owner.moveCard(card, 'discard');
            context.game.cardsDiscarded.push(card);
        });
    }
}

module.exports = DiscardCardAction;
