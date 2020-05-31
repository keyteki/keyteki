const Card = require('../../Card.js');

class Symon extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.returnToDeck((context) => ({
                target: context.event.card.location === 'play area' ? context.event.card : []
            }))
        });
    }
}

Symon.id = 'symon';

module.exports = Symon;
