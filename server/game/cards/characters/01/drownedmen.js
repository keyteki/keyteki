const DrawCard = require('../../../drawcard.js');

class DrownedMen extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardPlayed', 'onCardLeftPlay']);
        this.warshipStrength = 0;
    }

    calculateStrength() {
        this.strengthModifier -= this.warshipStrength;
        this.warshipStrength = this.controller.cardsInPlay.reduce((counter, card) => {
            if(this.isBlank() || card.getType() !== 'location' || !card.hasTrait('Warship')) {
                return counter;
            }

            return counter + 1;
        }, 0);
        this.strengthModifier += this.warshipStrength;
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

DrownedMen.code = '01073';

module.exports = DrownedMen;
