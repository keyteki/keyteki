const Card = require('../../Card.js');

class GraspingVine extends Card {
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

GraspingVine.id = 'grasping-vine'; // This is a guess at what the id might be - please check it!!!

module.exports = GraspingVine;
