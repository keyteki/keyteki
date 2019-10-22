const BlasterCard = require('./BlasterCard.js');

class GarciasBlaster extends BlasterCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: event => event.card === this && event.parent.name === 'Sensor Chief Garcia'
            },
            gameAction: ability.actions.steal()
        });

        this.setupBlasterCardAbilities(ability, 'Garcia\'s Blaster', 'Sensor Chief Garcia');
    }
}

GarciasBlaster.id = 'garcia-s-blaster';

module.exports = GarciasBlaster;
