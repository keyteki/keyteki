const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class BalonGreyjoy extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDefendersDeclared']);
    }

    onDefendersDeclared(event, challenge) {
        if(this.isBlank() || !challenge.isAttacking(this)) {
            return;
        }

        var strengthToReduce = _.reduce(challenge.defenders, (counter, card) => {
            if(card.getStrength() < this.getStrength()) {
                return counter + card.getStrength();
            }

            return counter;
        }, 0);

        challenge.modifyDefenderStrength(-strengthToReduce);
    }
}

BalonGreyjoy.code = '01068';

module.exports = BalonGreyjoy;
