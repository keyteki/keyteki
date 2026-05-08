const Card = require('../../Card.js');

class Kretchee extends Card {
    // Each time a player exalts a creature or a creature captures , put 1 on that creature from the common supply.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCapture: () => true,
                onExalt: () => true
            },
            gameAction: ability.actions.placeAmber((context) => ({
                target: context.event.card,
                amount: 1
            }))
        });
    }
}

Kretchee.id = 'kretchee';

module.exports = Kretchee;
