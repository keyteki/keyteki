const Card = require('../../Card.js');

class EdgeOfTheWorld extends Card {
    // Play: Move a creature to a flank of its controller’s battleline. Steal 1A.
    setupCardAbilities(ability) {
        this.play({
            effect: 'move {1} to a flank and steal 1 amber',
            effectArgs: (context) => context.target,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.moveToFlank()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.steal()
            }
        });
    }
}

EdgeOfTheWorld.id = 'edge-of-the-world';

module.exports = EdgeOfTheWorld;
