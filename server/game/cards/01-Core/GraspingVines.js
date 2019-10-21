const Card = require('../../Card.js');

class GraspingVines extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'upTo',
                numCards: 3,
                cardType: 'artifact',
                gameAction: ability.actions.returnToHand()
            }
        });
    }
}

GraspingVines.id = 'grasping-vines';

module.exports = GraspingVines;
