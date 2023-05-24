const Card = require('../../Card.js');

class ShizyokuSwopper extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.swap((context) => ({
                origin: context.event.card.location === 'play area' ? context.event.card : []
            }))
        });
    }
}

ShizyokuSwopper.id = 'shizyoku-swopper';

module.exports = ShizyokuSwopper;
