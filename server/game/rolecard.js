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

    allowGameAction(actionType, context = null) {
        let illegalActions = [
            'bow', 'ready', 'dishonor', 'honor', 'sacrifice',
            'discardFromPlay', 'moveToConflict', 'sendHome', 'putIntoPlay', 'putIntoConflict',
            'break', 'returnToHand', 'takeControl', 'placeFate', 'removeFate'
        ];
        if(illegalActions.includes(actionType)) {
            return false;
        }
        return super.allowGameAction(actionType, context);
    }
}

module.exports = RoleCard;
