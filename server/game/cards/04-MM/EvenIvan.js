const Card = require('../../Card.js');

class EvenIvan extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.steal((context) => ({
                amount: context.player.opponent && context.player.opponent.amber % 2 === 0 ? 1 : 0
            }))
        });
    }
}

EvenIvan.id = 'even-ivan';

module.exports = EvenIvan;
