const DrawCard = require('../drawcard.js');

class Reducer extends DrawCard {
    constructor(owner, cardData, reduceBy, condition) {
        super(owner, cardData);

        this.reduceBy = reduceBy;
        this.condition = condition;
    }

    onClick(player) {
        if(player.phase !== 'marshal' || this.controller !== player || this.kneeled || this.abilityUsed) {
            return false;
        }

        player.kneelCard(this);

        this.untilEndOfPhase(ability => ({
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.reduceNextMarshalledCardCost(this.reduceBy, this.condition)
        }));

        return true;
    }
}

class FactionCostReducer extends Reducer {
    constructor(owner, cardData, reduceBy, faction) {
        super(owner, cardData, reduceBy, (card) => {
            return card.isFaction(faction);
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
        super(owner, cardData, reduceBy, (card) => {
            return card.getType() === 'character' && card.isFaction(faction);
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
