const _ = require('underscore');

const BaseCard = require('./basecard.js');

class RoleCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.influenceModifier = 0;

        this.isRole = true;
    }

    getInfluence() {
        return this.cardData.influence_pool + this.influenceModifier;
    }

    flipFaceup() {
        this.facedown = false;
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let baseSummary = super.getSummary(activePlayer, hideWhenFaceup);

        return _.extend(baseSummary, {
            isRole: this.isRole,
            location: this.location
        });
    }


}

module.exports = RoleCard;
