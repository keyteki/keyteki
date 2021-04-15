const Card = require('../../Card.js');

class Holdfast extends Card {
    // After 1 of Holdfast's neighbors is dealt damage, ready Holdfast.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onDamageDealt: (event, context) => context.source.neighbors.includes(event.card)
            },
            gameAction: ability.actions.ready((context) => ({
                target: context.source
            }))
        });
    }
}

Holdfast.id = 'holdfast';

module.exports = Holdfast;
