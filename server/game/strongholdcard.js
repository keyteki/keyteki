const _ = require('underscore');

const BaseCard = require('./basecard.js');

class StrongholdCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.menu = _([{ command: 'bow', text: 'Bow/Ready' }]);
        this.bowed = false;

        this.isStronghold = true;
    }

    getFate() {
        return this.cardData.fate;
    }

    getStartingHonor() {
        return this.cardData.honor;
    }

    getInfluence() {
        return this.cardData.influence_pool;
    }

    getProvinceStrengthBonus() {
        return parseInt(this.cardData.strength_bonus);
    }

    bow() {
        this.bowed = true;
    }

    ready() {
        this.bowed = false;
    }

    flipFaceup() {
        this.facedown = false;
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let baseSummary = super.getSummary(activePlayer, hideWhenFaceup);

        return _.extend(baseSummary, {
            isStronghold: this.isStronghold,
            bowed: this.bowed
        });
    }
}

module.exports = StrongholdCard;
