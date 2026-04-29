const Card = require('../../Card.js');

class PiSweven extends Card {
    // (T) Reap: If the tide is high, draw 3 cards.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.draw({ amount: 3 })
        });
    }
}

PiSweven.id = 'pi-sweven';

module.exports = PiSweven;
