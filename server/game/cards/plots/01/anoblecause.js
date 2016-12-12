const PlotCard = require('../../../plotcard.js');

class ANobleCause extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.abilityUsed = false;
    }

    canReduce(player, card) {
        if(!this.inPlay || this.controller !== player) {
            return false;
        }

        if(this.abilityUsed || (!card.hasTrait('Lord') && !card.hasTrait('Lady'))) {
            return false;
        }

        return true;
    }

    reduce(card, currentCost, spending) {
        if(this.abilityUsed) {
            return currentCost;
        }


        var cost = currentCost - 2;

        if(cost < 0) {
            cost = 0;
        }

        if(spending) {
            this.game.addMessage('{0} uses {1} to reduce the cost of {2} by 2', this.controller, this, card);
            this.abilityUsed = true;
        }

        return cost;
    }

    leavesPlay() {
        this.abilityUsed = false;
    }
}

ANobleCause.code = '01004';

module.exports = ANobleCause;
