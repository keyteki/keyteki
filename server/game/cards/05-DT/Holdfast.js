const Card = require('../../Card.js');

class Holdfast extends Card {
    // After 1 of Holdfast's neighbors is dealt damage, ready Holdfast.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) => {
                    return event.clone.clonedNeighbors.includes(context.source);
                }
            },
            gameAction: ability.actions.ready()
        });
    }
}

Holdfast.id = 'holdfast';

module.exports = Holdfast;
