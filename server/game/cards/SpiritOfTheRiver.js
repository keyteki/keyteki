const DrawCard = require('../drawcard.js');

class SpiritOfTheRiver extends DrawCard {
    constructor(facedownCard) {
        super(facedownCard.owner, {
            clan: 'neutral',
            cost: null,
            glory: 0,
            id: 'spirit-of-the-river',
            military: 1,
            name: 'Spirit of the River',
            political: null,
            side: 'dynasty',
            text: '',
            type: 'character',
            traits: ['spirit', 'cavalry'],
            unicity: false
        });
        this.facedownCard = facedownCard;
    }

    leavesPlay() {
        this.owner.moveCard(this.facedownCard, 'dynasty discard pile');
        this.game.queueSimpleStep(() => {
            this.owner.removeCardFromPile(this);
            this.game.allCards = this.owner.removeCardByUuid(this.game.allCards, this.uuid);
        });
        super.leavesPlay();
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let summary = super.getSummary(activePlayer, hideWhenFaceup);
        return Object.assign(summary, { isToken: true });
    }
}

module.exports = SpiritOfTheRiver;
