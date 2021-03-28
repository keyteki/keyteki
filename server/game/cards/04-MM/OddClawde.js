const Card = require('../../Card.js');

class OddClawde extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.steal((context) => ({
                amount: context.player.opponent && context.player.opponent.amber % 2 !== 0 ? 1 : 0
            }))
        });
    }
}

OddClawde.id = 'odd-clawde';

module.exports = OddClawde;
