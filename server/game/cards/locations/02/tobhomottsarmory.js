const DrawCard = require('../../../drawcard.js');

class TobhoMottsArmory extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: (event, winner) => this.controller === winner
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.controller.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} to draw a card', this.controller, this);
            }
        });
    }
}

TobhoMottsArmory.code = '02069';

module.exports = TobhoMottsArmory;
