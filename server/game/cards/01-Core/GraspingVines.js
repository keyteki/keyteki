const Card = require('../../Card.js');

class GraspingVines extends Card {
    // Play: Return up to 3artifacts to their owners hands.
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
