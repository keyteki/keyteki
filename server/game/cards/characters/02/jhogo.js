const DrawCard = require('../../../drawcard.js');
 
class Jhogo extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardPlayed', 'onCardLeftPlay']);
    }

    getNumberOfBloodriders() {
        var cards = this.controller.cardsInPlay.reduce((runningTotal, card) => {
            if(!this.isBlank() && card.hasTrait('Bloodrider') && card.getType() === 'character' && card !== this) {
                return runningTotal + 1;
            }

            return runningTotal;
        }, 0);

        return cards;        
    }    

    play() {
        super.play();

        if(this.getNumberOfBloodriders() >= 1) {
            this.addKeyword('Stealth');
        }
    }
    
    leavesPlay() {
        super.leavesPlay();

        if(this.getNumberOfBloodriders() >= 1) {
            this.removeKeyword('Stealth');
        }
    }

    onCardPlayed(event, player) {
        if(this.controller !== player) {
            return;
        }

        if(this.getNumberOfBloodriders() >= 1) {
            this.addKeyword('Stealth');
        }
    }

    onCardLeftPlay(event, player) {
        if(this.controller !== player) {
            return;
        }
    
        if(this.getNumberOfBloodriders() < 1) {
            this.removeKeyword('Stealth');
        }
    }    
}

Jhogo.code = '02113';

module.exports = Jhogo;
