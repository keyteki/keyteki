const DrawCard = require('../../../drawcard.js');

class TobhoMottsArmory extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: (event, winner) => this.controller === winner && !this.kneeled
            },
            handler: () => {
                this.controller.kneelCard(this);
                this.game.addMessage('{0} uses {1} to draw a card', this.controller, this);
                this.controller.drawCardsToHand(1);
            }
        });
    }
}

TobhoMottsArmory.code = '02069';

module.exports = TobhoMottsArmory;
