const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class AbductAction extends CardGameAction {
    setDefaultProperties() {
        this.player = null; // If set, archives to this player instead of context.player
    }

    setup() {
        super.setup();
        this.name = 'abduct';
        this.effectMsg = 'abduct {0}';
    }

    getEvent(card, context) {
        const abductor = this.player || context.player;
        return super.createEvent(EVENTS.onCardArchived, { card: card, context: context }, () => {
            // Mark the card as abducted. This flag is checked in player.moveCard
            // to redirect the card to owner's hand when leaving archives.
            card.abducted = true;

            // Move the card to archives
            if (card.location === 'play area') {
                context.game.raiseEvent(EVENTS.onCardLeavesPlay, { card, context }, () =>
                    abductor.moveCard(card, 'archives')
                );
            } else {
                abductor.moveCard(card, 'archives');
            }
        });
    }
}

module.exports = AbductAction;
