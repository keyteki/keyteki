const Card = require('../../Card.js');

class DeepwoodDruid extends Card {
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            target: {
                cardType: 'creature',
                optional: false,
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
