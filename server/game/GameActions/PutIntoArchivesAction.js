const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class PutIntoArchivesAction extends CardGameAction {
    setDefaultProperties() {
        this.owner = true;
        this.opponent = false;
    }

    setup() {
        super.setup();
        this.name = 'archive';
        if (
            this.target.every((card) => ['play area', 'discard', 'purged'].includes(card.location))
        ) {
            this.effectMsg = 'put {0} into archives';
        } else if (this.target.length === 1) {
            this.effectMsg = 'put a card into archives';
        } else {
            this.effectMsg = 'put ' + this.target.length.toString() + ' cards into archives';
        }
    }

    getEvent(card, context) {
        return super.createEvent(
            EVENTS.onCardPutIntoArchives,
            { card: card, context: context },
            () => {
                let player = this.owner
                    ? card.owner
                    : this.opponent
                    ? context.player.opponent
                    : context.player;
                if (card.location === 'play area') {
                    context.game.raiseEvent(EVENTS.onCardLeavesPlay, { card, context }, () =>
                        player.moveCard(card, 'archives')
                    );
                } else {
                    player.moveCard(card, 'archives');
                }
            }
        );
    }
}

module.exports = PutIntoArchivesAction;
