const Reducer = require('../reducer.js').Reducer;

class Fealty extends Reducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, (player, card) => {
            return card.isLoyal();
        });

        this.menu.push({ text: 'Kneel your faction card', method: 'onClick' });
    }

    onClick(player) {
        if(!this.controller === player) {
            return;
        }

        player.faction.kneeled = true;

        this.game.addMessage('{0} uses {1} to kneel their faction card and reduce the cost of the next loyal card by 1', player, this);
    }

    canReduce(player, card) {
        if(!this.inPlay || this.controller !== player || !player.faction.kneeled || this.abilityUsed) {
            return false;
        }

        return this.condition(player, card);
    }

    reduce(card, currentCost, spending) {
        if(this.controller.faction.kneeled && !this.abilityUsed) {
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
}

Fealty.code = '01027';

module.exports = Fealty;
