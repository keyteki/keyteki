const Card = require('../../Card.js');

class Scyphos extends Card {
    // Hazardous 4.
    // (T) Destroyed: If the tide is high, archive Scyphos.
    setupCardAbilities(ability) {
        this.destroyed({
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.archive((context) => ({
                target: context.source
            }))
        });
    }
}

Scyphos.id = 'scyphos';

module.exports = Scyphos;
