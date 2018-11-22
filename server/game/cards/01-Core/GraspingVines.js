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

GraspingVines.id = 'grasping-vines'; // This is a guess at what the id might be - please check it!!!

module.exports = GraspingVines;
