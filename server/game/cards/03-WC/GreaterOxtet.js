const Card = require('../../Card.js');

class GreaterOxtet extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardsReadied: (event, context) => context.player === this.game.activePlayer
            },
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.purge()
            },
            then: {
                gameAction: ability.actions.addPowerCounter({ amount: 2 })
            }
        });
    }
}

GreaterOxtet.id = 'greater-oxtet';

module.exports = GreaterOxtet;
