const DrawCard = require('../../../drawcard.js');
 
class Viserion extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardPlayed', 'onCardLeftPlay']);
    }

    play() {
        super.play();

        this.controller.cardsInPlay.each(card => {
            if(card.hasTrait('Stormborn')) {
                card.addKeyword('Stealth');
            }
        });
    }
    
    leavesPlay() {
        super.leavesPlay();

        this.controller.cardsInPlay.each(card => {
            if(card.hasTrait('Stormborn')) {
                card.removeKeyword('Stealth');
            }
        });
    }

    onCardPlayed(event, player, card) {
        if(this.controller !== player) {
            return;
        }

        if(card.hasTrait('Stormborn')) {
            card.addKeyword('Stealth');
        }
    }

    onCardLeftPlay(event, player, card) {
        if(this.controller !== player) {
            return;
        }
    
        if(card.hasTrait('Stormborn')) {
            card.removeKeyword('Stealth');
        }
    }    
}

Viserion.code = '01166';

module.exports = Viserion;
