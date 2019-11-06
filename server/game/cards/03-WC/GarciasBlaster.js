const BlasterCard = require('./BlasterCard.js');

class GarciasBlaster extends BlasterCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: (event, context) =>
                    event.card === context.source && event.parent.name === 'Sensor Chief Garcia' &&
                    event.context.player === event.card.controller
            },
            gameAction: ability.actions.steal()
        });

        this.setupBlasterCardAbilities(ability, 'Sensor Chief Garcia');
    }
}

GarciasBlaster.id = 'garcia-s-blaster';

module.exports = GarciasBlaster;
