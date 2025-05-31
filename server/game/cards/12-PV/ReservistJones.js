const Card = require('../../Card.js');

class ReservistJones extends Card {
    // Deploy.
    // Play: Capture 2 amber for each of Reservist Jones's non-Star Alliance neighbors.
    setupCardAbilities(ability) {
        this.play({
            effect: 'capture 2 amber for each of its non-Star Alliance neighbors',
            gameAction: ability.actions.capture((context) => ({
                amount:
                    context.source.neighbors.filter((card) => !card.hasHouse('staralliance'))
                        .length * 2
            }))
        });
    }
}

ReservistJones.id = 'reservist-jones';

module.exports = ReservistJones;
