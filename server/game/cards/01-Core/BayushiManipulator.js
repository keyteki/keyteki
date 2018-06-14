const DrawCard = require('../../drawcard.js');

class BayushiManipulator extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Increase bid by 1',
            when: {
                onHonorDialsRevealed: () => true
            },
            effect: 'increase their bid by 1',
            gameAction: ability.actions.modifyBid()
        });
    }
}

BayushiManipulator.id = 'bayushi-manipulator';

module.exports = BayushiManipulator;
