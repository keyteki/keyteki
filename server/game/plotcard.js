const BaseCard = require('./basecard.js');

class PlotCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.reserveModifier = 0;
        this.goldModifier = 0;
        this.initiativeModifier = 0;
        this.claimModifier = 0;
    }

    hasRevealEffect() {
        return this.cardData.text && this.cardData.text.indexOf('When Revealed:') !== -1;
    }

    getInitiative() {
        var baseValue = this.canProvidePlotModifier['initiative'] ? this.cardData.initiative : 0;
        return baseValue + this.initiativeModifier;
    }

    getIncome(printed) {
        if(printed) {
            return this.cardData.income;
        }

        var baseValue = this.canProvidePlotModifier['gold'] ? (this.baseIncome || this.cardData.income) : 0;

        return baseValue + this.goldModifier;
    }

    getReserve() {
        var baseValue = this.canProvidePlotModifier['reserve'] ? this.cardData.reserve : 0;
        return baseValue + this.reserveModifier;
    }

    getClaim() {
        return this.cardData.claim + this.claimModifier;
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
