const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class AbductAction extends CardGameAction {
    setDefaultProperties() {
        this.reveal = false;
    }

    setup() {
        super.setup();
        this.name = 'abduct';
        this.effectMsg = 'abduct {0}';
    }

    getEvent(card, context) {
        return super.createEvent(EVENTS.onCardArchived, { card: card, context: context }, () => {
            let player = context.player;

            // Mark the card as abducted. This flag is checked in player.moveCard
            // to redirect the card to owner's hand when leaving archives.
            card.abducted = true;

            // Move the card to archives
            if (card.location === 'play area') {
                context.game.raiseEvent(EVENTS.onCardLeavesPlay, { card, context }, () =>
                    player.moveCard(card, 'archives')
                );
            } else {
                player.moveCard(card, 'archives');
            }
        });
    }
}

module.exports = AbductAction;
