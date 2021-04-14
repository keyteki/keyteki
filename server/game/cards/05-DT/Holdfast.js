const Card = require('../../Card.js');

class Holdfast extends Card {
    //After one of Dog's neighbors is dealt damage, ready Dog.
    //This card has been translated from Polish and is subject to change.
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
