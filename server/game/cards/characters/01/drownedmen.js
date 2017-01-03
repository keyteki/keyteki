const DrawCard = require('../../../drawcard.js');

class DrownedMen extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardPlayed', 'onCardLeftPlay']);
    }

    calculateStrength() {
        this.strengthModifier = this.controller.cardsInPlay.reduce((counter, card) => {
            if(card.getType() !== 'location' || !card.hasTrait('Warship')) {
                return counter;
            }

            return counter + 1;
        }, 0);
    }

    play(player) {
        super.play(player);

        this.calculateStrength();
    }

    onCardPlayed(e, player) {
        if(this.controller !== player) {
            return;
        }

        this.calculateStrength();
    }

    onCardLeftPlay(e, player) {
        if(this.controller !== player) {
            return;
        }

        this.calculateStrength();
    }
}

DrownedMen.code = '01073';

module.exports = DrownedMen;
