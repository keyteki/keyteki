const DrawCard = require('../../../drawcard.js');

class WardensOfTheReach extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardPlayed', 'onCardLeftPlay']);
    }

    calculateStrength() {
        this.strengthModifier = this.controller.cardsInPlay.reduce((counter, card) => {
            if(this.isBlank() || card.getType() !== 'location' || !card.hasTrait('The Reach')) {
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

    setBlank() {
        super.setBlank();

        this.calculateStrength();
    }

    clearBlank() {
        super.clearBlank();

        this.calculateStrength();
    }
}

WardensOfTheReach.code = '01190';

module.exports = WardensOfTheReach;
