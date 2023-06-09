const BlasterCard = require('./BlasterCard.js');

class GarciasBlaster extends BlasterCard {
    // This creature gains, Fight/Reap: You may deal 2D to a creature, or attach Garcias Blaster to Sensor Chief Garcia.
    // After you attach Garcias Blaster to Sensor Chief Garcia, steal 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: (event, context) =>
                    event.card === context.source &&
                    event.parent.name === 'Sensor Chief Garcia' &&
                    event.context.player === event.card.controller
            },
            gameAction: ability.actions.steal()
        });

        this.setupBlasterCardAbilities(ability, 'Sensor Chief Garcia');
    }
}

GarciasBlaster.id = 'garcia-s-blaster';

module.exports = GarciasBlaster;
