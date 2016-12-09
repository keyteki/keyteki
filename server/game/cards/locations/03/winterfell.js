const DrawCard = require('../../../drawcard.js');

class Winterfell extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardPlayed']);
    }

    play(player) {
        super.play(player);

        player.cardsInPlay.each(card => {
            if(card.getFaction() === this.getFaction() && card.getType() === 'character') {
                card.strengthModifier++;
            }
        });
    }

    onCardPlayed(e, player, cardId) {
        if(!this.inPlay || this.controller !== player) {
            return;
        }

        var card = player.findCardInPlayByUuid(cardId);
        if(!card) {
            return;
        }

        if(card.getFaction() === this.getFaction() && card.getType() === 'character') {
            card.strengthModifier++;
        }
    }

    leavesPlay() {
        super.leavesPlay();

        this.controller.cardsInPlay.each(card => {
            if(card.getFaction() === this.getFaction() && card.getType() === 'character') {
                card.strengthModifier--;
            }
        });
    }
}

Winterfell.code = '03017';

module.exports = Winterfell;
