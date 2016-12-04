const DrawCard = require('../../../drawcard.js');

class TheWall extends DrawCard {
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
        if(!this.inPlay || this.owner !== player) {
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

    onUnopposedWin(winner) {
        if(this.owner !== winner && !this.kneeled) {
            this.game.addMessage('{0} is forced to kneel {1} because they lost an unopposed challenge', this.owner, this);
            this.kneeled = true;
        }
    }

    leavesPlay() {
        super.leavesPlay();

        this.owner.cardsInPlay.each(card => {
            if(card.getFaction() === this.getFaction() && card.getType() === 'character') {
                card.strengthModifier--;
            }
        });
    }
}

TheWall.code = '01137';

module.exports = TheWall;
