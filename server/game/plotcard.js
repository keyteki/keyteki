const BaseCard = require('./basecard.js');

class PlotCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.reserveModifier = 0;
        this.goldModifier = 0;
    }

    hasRevealEffect() {
        return this.cardData.text && this.cardData.text.indexOf('When Revealed:') !== -1;
    }

    getInitiative() {
        return this.cardData.initiative;
    }

    getIncome(printed) {
        if(printed) {
            return this.cardData.income;
        }

        return this.cardData.income + this.goldModifier;
    }

    getReserve() {
        return this.cardData.reserve + this.reserveModifier;
    }

    getClaim() {
        return this.cardData.claim;
    }

    modifyIncome(player, income) {
        return income;
    }

    canChallenge() {
        return true;
    }

    flipFaceup() {
        this.facedown = false;
    }

    onBeginChallengePhase() {
    }
}

module.exports = PlotCard;
