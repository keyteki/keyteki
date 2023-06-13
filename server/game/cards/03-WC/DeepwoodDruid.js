const Card = require('../../Card.js');

class DeepwoodDruid extends Card {
    // Deploy. (This creature can enter play anywhere in your battleline.)
    // Play/Reap: Fully heal a neighboring creature.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            target: {
                cardType: 'creature',
                numCards: 1,
                controller: 'self',
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.heal({ fully: true })
            }
        });
    }
}

DeepwoodDruid.id = 'deepwood-druid';

module.exports = DeepwoodDruid;
