const _ = require('underscore');

const BaseCard = require('./basecard.js');

class ProvinceCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.strengthModifier = 0;
        this.isProvince = true;
        this.isBroken = false;
    }

    getStrength() {
        return this.cardData.strength + this.strengthModifier;
    }

    flipFaceup() {
        this.facedown = false;
    }
    
    breakProvince() {
        this.isBroken = true;
    }

    canTriggerAbilities() {
        if(!this.location.includes('province') || this.facedown) {
            return false;
        }
        return super.canTriggerAbilities();
    }
    
    getSummary(activePlayer, hideWhenFaceup) {
        let baseSummary = super.getSummary(activePlayer, hideWhenFaceup);

        return _.extend(baseSummary, {
            isProvince: this.isProvince,
            strength: this.getStrength(),
            isBroken: this.isBroken
        });
    }

}

module.exports = ProvinceCard;
