import CardGameAction from './CardGameAction.js';

class ArchiveAction extends CardGameAction {
    setDefaultProperties() {
        this.owner = true;
        this.opponent = false;
        this.reveal = false;
    }

    setup() {
        super.setup();
        this.name = 'archive';
        if (
            this.reveal ||
            this.target.every((card) => ['play area', 'discard', 'purged'].includes(card.location))
        ) {
            this.effectMsg = 'archive {0}';
        } else if (this.target.length === 1) {
            this.effectMsg = 'archive a card';
        } else {
            this.effectMsg = 'archive ' + this.target.length.toString() + ' cards';
        }
    }

    getEvent(card, context) {
        return super.createEvent('onCardArchived', { card: card, context: context }, () => {
            let player = this.owner
                ? card.owner
                : this.opponent
                ? context.player.opponent
                : context.player;
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

export default ArchiveAction;
