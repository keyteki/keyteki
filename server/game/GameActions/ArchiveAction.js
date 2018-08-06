const CardGameAction = require('./CardGameAction');

class ArchiveAction extends CardGameAction {
    setup() {
        super.setup();
        this.name = 'archive';
        this.effectMsg = 'archive {0}';
    }

    getEvent(card, context) {
        return super.createEvent('onCardArchived', { card: card, context: context }, () => context.player.moveCard(card, 'archives'));
    }
}

module.exports = ArchiveAction;
