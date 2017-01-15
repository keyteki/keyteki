const DrawCard = require('../drawcard.js');

class Reducer extends DrawCard {
    constructor(owner, cardData, reduceBy, condition) {
        super(owner, cardData);

        this.reduceBy = reduceBy;
        this.condition = condition;
        this.abilityUsed = false;

        this.registerEvents(['onBeginRound']);
    }

    canReduce(player, card) {
        if(this.controller !== player || !this.kneeled || this.abilityUsed) {
            return false;
        }

        return this.condition(player, card);
    }

    onClick(player) {
        if(player.phase !== 'marshal' || this.controller !== player || this.kneeled || this.abilityUsed) {
            return false;
        }

        player.kneelCard(this);

        return true;
    }

    reduce(card, currentCost, spending) {
        if(this.kneeled && !this.abilityUsed) {
            var cost = currentCost - this.reduceBy;

            if(spending) {
                this.abilityUsed = true;
            }

            if(cost < 0) {
                cost = 0;
            }

            return cost;
        }

        return currentCost;
    }

    onBeginRound() {
        this.abilityUsed = false;
    }

    leavesPlay() {
        this.abilityUsed = false;
        super.leavesPlay();
    }
}

class FactionCostReducer extends Reducer {
    constructor(owner, cardData, reduceBy, faction) {
        super(owner, cardData, reduceBy, (player, card) => {
            return card.getFaction() === faction;
        });

        this.faction = faction;
    }

    onClick(player) {
        var canUse = super.onClick(player);

        if(canUse) {
            this.game.addMessage('{0} uses {1} to reduce the cost of the next {2} card by {3}',
                player, this, this.faction, this.reduceBy);
        }

        return canUse;
    }
}

class FactionCharacterCostReducer extends Reducer {
    constructor(owner, cardData, reduceBy, faction) {
        super(owner, cardData, reduceBy, (player, card) => {
            return card.getType() === 'character' && card.getFaction() === faction;
        });

        this.faction = faction;
    }

    onClick(player) {
        var canUse = super.onClick(player);

        if(canUse) {
            this.game.addMessage('{0} uses {1} to reduce the cost of the next {2} character by {3}',
                player, this, this.faction, this.reduceBy);
        }

        return canUse;
    }
}

module.exports = {
    Reducer: Reducer,
    FactionCostReducer: FactionCostReducer,
    FactionCharacterCostReducer: FactionCharacterCostReducer
};
