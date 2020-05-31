const Card = require('../../Card.js');

class Drumble extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent && context.player.opponent.amber >= 7,
            gameAction: ability.actions.capture((context) => ({
                amount: context.player.opponent.amber
            }))
        });
    }
}

Drumble.id = 'drumble';

module.exports = Drumble;
