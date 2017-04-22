const _ = require('underscore');

const BaseCard = require('./basecard.js');
const CardWhenRevealed = require('./cardwhenrevealed.js');

class PlotCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.reserveModifier = 0;
        this.goldModifier = 0;
        this.initiativeModifier = 0;
        this.claimModifier = 0;
    }

    whenRevealed(properties) {
        let whenClause = {
            when: {
                onPlotsWhenRevealed: event => event.plots.includes(this)
            }
        };
        let reaction = new CardWhenRevealed(this.game, this, _.extend(whenClause, properties));
        this.abilities.reactions.push(reaction);
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
