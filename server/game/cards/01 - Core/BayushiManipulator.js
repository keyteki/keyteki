const DrawCard = require('../../drawcard.js');

class BayushiManipulator extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Increase bid by 1',
            when: {
                onHonorDialsRevealed: () => true
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to increase their bid by 1', this.controller, this);
                this.controller.honorBid++;
            }
        });
    }
}

BayushiManipulator.id = 'bayushi-manipulator';

module.exports = BayushiManipulator;
