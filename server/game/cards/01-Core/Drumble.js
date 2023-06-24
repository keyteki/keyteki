const Card = require('../../Card.js');

class Drumble extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Play: If your opponent has 7<A> or more, capture all of it.
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
