const _ = require('underscore');

const BaseCard = require('./basecard.js');

class PlotCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.reserveModifier = 0;
        this.goldMofidier = 0;
    }

    hasRevealEffect() {
        return this.cardData.text && this.cardData.text.indexOf('When Revealed:') !== -1;
    }

    getInitiative() {
        return this.cardData.initiative;
    }

    getIncome() {
        return this.cardData.income + this.goldMofidier;
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
        this.inPlay = true;
        this.facedown = false;
    }

    onReveal() {
        return true;
    }

    onBeginChallengePhase() {
    }
}

module.exports = PlotCard;
