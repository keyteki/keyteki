const _ = require('underscore');

const BaseCard = require('./basecard.js');

class PlotCard extends BaseCard {
    hasRevealEffect() {
        return this.cardData.text && this.cardData.text.indexOf('When Revealed:') !== -1;
    }

    getInitiative() {
        return this.cardData.initiative;
    }

    getIncome() {
        return this.cardData.income;
    }

    getReserve() {
        return this.cardData.reserve;
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
