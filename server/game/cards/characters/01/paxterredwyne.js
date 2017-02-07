const DrawCard = require('../../../drawcard.js');

class PaxterRedwyne extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onBeginRound']);
    }

    setupCardAbilities() {
        this.plotModifiers({
            gold: 1
        });
    }

    onBeginRound() {
        this.abilityUsed = false;
    }

    canReduce(player, card) {
        if(this.controller !== player || this.abilityUsed || card.getType() !== 'event') {
            return false;
        }

        return true;
    }

    reduce(card, currentCost, spending) {
        if(!this.abilityUsed) {
            var cost = currentCost - 1;

            if(spending) {
                this.abilityUsed = true;

                this.game.addMessage('{0} uses {1} to reduce the cost of {2} by 1', this.controller, this, card);
            }

            if(cost < 0) {
                cost = 0;
            }

            return cost;
        }

        return currentCost;
    }
}

PaxterRedwyne.code = '01182';

module.exports = PaxterRedwyne;
