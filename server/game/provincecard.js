const _ = require('underscore');

const BaseCard = require('./basecard.js');

class ProvinceCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.strengthModifier = 0;
        this.isProvince = true;
    }

    getStrength() {
        return this.cardData.strength + this.strengthModifier;
    }

    flipFaceup() {
        this.facedown = false;
    }

}

module.exports = ProvinceCard;
