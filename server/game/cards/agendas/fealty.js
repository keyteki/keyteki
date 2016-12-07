const Reducer = require('../reducer.js').Reducer;
 
class Fealty extends Reducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, (player, card) => {
            return card.isLoyal();
        });

        this.menu.push({ text: 'Kneel your faction card', method: 'onClick' });

        this.registerEvents(['cardsStanding']);
    }

    onClick(player) {
        if(!this.owner === player) {
            return;
        }

        player.faction.kneeled = true;

        this.game.addMessage('{0} uses {1} to kneel their faction card and reduce the cost of the next loyal card by 1', player, this);
    }

    canReduce(player, card) {
        if(!this.inPlay || this.owner !== player || !player.faction.kneeled || this.abilityUsed) {
            return false;
        }

        return this.condition(player, card);
    }

    reduce(card, currentCost, spending) {
        if(this.owner.faction.kneeled && !this.abilityUsed) {
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

    cardsStanding() {
        this.owner.faction.kneeled = false;
    }
}

Fealty.code = '01027';

module.exports = Fealty;
