const CardGameAction = require('./CardGameAction');

class PurgeAction extends CardGameAction {
    setup() {
        super.setup();
        this.name = 'purge';
        this.effectMsg = 'purge {0}';
    }

    getEvent(card, context) {
        return super.createEvent('onCardPurged', { card: card, context: context }, () => {
            if (card.location === 'play area') {
                context.game.raiseEvent('onCardLeavesPlay', { card, context }, () =>
                    card.owner.moveCard(card, 'purged')
                );
            } else {
                card.owner.moveCard(card, 'purged');
            }
        });
    }
}

module.exports = PurgeAction;
