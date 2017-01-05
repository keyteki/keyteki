const DrawCard = require('../../../drawcard.js');
 
class Drogon extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardPlayed', 'onCardLeftPlay']);
    }

    play() {
        super.play();

        this.controller.cardsInPlay.each(card => {
            if(card.hasTrait('Stormborn')) {
                card.addKeyword('Renown');
            }
        });
    }
    
    leavesPlay() {
        super.leavesPlay();

        this.controller.cardsInPlay.each(card => {
            if(card.hasTrait('Stormborn')) {
                card.removeKeyword('Renown');
            }
        });
    }

    onCardPlayed(event, player, card) {
        if(this.controller !== player) {
            return;
        }

        if(card.hasTrait('Stormborn')) {
            card.addKeyword('Renown');
        }
    }

    onCardLeftPlay(event, player, card) {
        if(this.controller !== player) {
            return;
        }
    
        if(card.hasTrait('Stormborn')) {
            card.removeKeyword('Renown');
        }
    }    
}

Drogon.code = '01161';

module.exports = Drogon;
