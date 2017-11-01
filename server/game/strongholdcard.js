const _ = require('underscore');

const BaseCard = require('./basecard.js');

class StrongholdCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.strengthModifier = 0;
        this.fateModifier = 0;
        this.honorModifier = 0;
        this.influenceModifier = 0;
        this.menu = _([{ command: 'bow', text: 'Bow/Ready' }]);

        this.isStronghold = true;
    }

    getFate() {
        return this.cardData.fate + this.fateModifier;
    }

    getStartingHonor() {
        return this.cardData.honor + this.honorModifier;
    }

    getInfluence() {
        return this.cardData.influence_pool + this.influenceModifier;
    }

    getProvinceStrengthBonus() {
        return parseInt(this.cardData.strength_bonus) + this.strengthModifier;
    }

    flipFaceup() {
        this.facedown = false;
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let baseSummary = super.getSummary(activePlayer, hideWhenFaceup);

        return _.extend(baseSummary, {
            isStronghold: this.isStronghold,
            strengthModifer: this.getStrengthModifier,
            bowed: this.bowed
        });
    }


}

module.exports = StrongholdCard;
