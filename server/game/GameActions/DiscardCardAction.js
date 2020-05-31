const CardGameAction = require('./CardGameAction');

class DiscardCardAction extends CardGameAction {
    setup() {
        super.setup();
        this.name = 'discard';
        this.effectMsg = 'discard {0}';
        this.cost = 'discarding {0}';
    }

    getEvent(card, context) {
        let location = card.location;
        return super.createEvent('onCardDiscarded', { card, context, location }, () => {
            if (card.location === 'hand') {
                context.game.cardsDiscarded.push(card);
            }

            card.owner.moveCard(card, 'discard');
        });
    }
}

module.exports = DiscardCardAction;
