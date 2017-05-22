const _ = require('underscore');

const BaseCard = require('./basecard.js');

class ProvinceCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.strengthModifier = 0;
    }

    getStrength() {
        return this.cardData.strength + this.strengthModifier;
    }



    flipFaceup() {
        this.facedown = false;
    }

    onBeginChallengePhase() {
    }
}

module.exports = PlotCard;
