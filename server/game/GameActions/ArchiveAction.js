const CardGameAction = require('./CardGameAction');

class ArchiveAction extends CardGameAction {
    setDefaultProperties() {
        this.owner = true;
    }

    setup() {
        super.setup();
        this.name = 'archive';
        if (this.target.every((card) => ['play area', 'discard'].includes(card.location))) {
            this.effectMsg = 'archive {0}';
        } else if (this.target.length === 1) {
            this.effectMsg = 'archive a card';
        } else {
            this.effectMsg = 'archive ' + this.target.length.toString() + ' cards';
        }
    }

    getEvent(card, context) {
        return super.createEvent('onCardArchived', { card: card, context: context }, () => {
            let player = this.owner ? card.owner : context.player;
            if (card.location === 'play area') {
                context.game.raiseEvent('onCardLeavesPlay', { card, context }, () =>
                    player.moveCard(card, 'archives')
                );
            } else {
                player.moveCard(card, 'archives');
            }
        });
    }
}

module.exports = ArchiveAction;
