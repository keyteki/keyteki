const Card = require('../../Card.js');

class EvenIvan extends Card {
    // Action: If your opponent has an even amount of A, steal 1A.
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
