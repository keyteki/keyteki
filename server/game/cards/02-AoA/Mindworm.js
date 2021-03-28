const Card = require('../../Card.js');

class Mindworm extends Card {
    setupCardAbilities(ability) {
        this.beforeFight({
            effect: 'make {1} deal {2} damage to each of its neighbors',
            effectArgs: (context) => [context.event.card.name, context.event.card.power],
            gameAction: ability.actions.dealDamage((context) => ({
                amount: context.event.card.power,
                target: context.event.card.neighbors
            }))
        });
    }
}

Mindworm.id = 'mindworm';

module.exports = Mindworm;
