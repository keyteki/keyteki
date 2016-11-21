const PlotCard = require('../../../plotcard.js');

class ANobleCause extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);
    
        this.abilityUsed = false;
    }

    canReduce(player, card) {
        if(!this.inPlay || this.owner !== player) {
            return false;
        }

        if(this.abilityUsed || !card.hasTrait('Lord') && !card.hasTrait('Lady')) {
            return false;
        }

        return true;
    }

    reduce(card, currentCost) {
        if(this.abilityUsed) {
            return currentCost;
        }

        this.abilityUsed = true;

        var cost = currentCost - 3;

        if(cost < 0) {
            cost = 0;
        }

        this.game.addMessage('{0} uses {1} to reduce the cost of {2} by 3', this.owner, this, card);

        return cost;
    }

    leavesPlay() {
        this.abilityUsed = false;
    }
}

ANobleCause.code = '01004';

module.exports = ANobleCause;
