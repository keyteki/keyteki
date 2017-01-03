const DrawCard = require('../../../drawcard.js');

class SansaStark extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onBeginMarshal', 'onCardPlayed', 'onCharacterKilled']);

        this.lastGold = 0;
    }

    updateStrength(card) {
        this.strengthModifier = this.controller.deadPile.reduce((count, card) => {
            if(card.getFaction() === 'stark') {
                return count - 1;
            }

            return count;
        }, 0);

        if(card && card.getFaction() === 'stark') {
            this.strengthModifier--;
        }

        if((this.cardData.strength + this.strengthModifier) < 0) {
            this.strengthModifier = -this.cardData.strength;
        }

        if(this.getStrength() === 0) {
            this.addKeyword('insight');
        } else if(this.hasKeyword('insight')) {
            this.removeKeyword('insight');
        }
    }

    onBeginMarshal(event, player) {
        if(this.controller !== player) {
            return;
        }

        this.updateStrength();
    }

    onCardPlayed(event, player) {
        if(this.controller !== player) {
            return;
        }

        this.updateStrength();
    }

    onCharacterKilled(event, player, card) {
        if(this.controller !== player) {
            return;
        }

        this.updateStrength(card);
    }

    leavesPlay() {
        super.leavesPlay();

        if(this.hasKeyword('insight')) {
            this.removeKeyword('insight');
        }
    }
}

SansaStark.code = '03013';

module.exports = SansaStark;
