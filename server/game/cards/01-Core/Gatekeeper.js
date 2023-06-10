const Card = require('../../Card.js');

class Gatekeeper extends Card {
    // Play: If your opponent has 7 or more A, capture all but 5 of it.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent && context.player.opponent.amber >= 7,
            gameAction: ability.actions.capture((context) => ({
                amount: context.player.opponent.amber - 5
            }))
        });
    }
}

Gatekeeper.id = 'gatekeeper';

module.exports = Gatekeeper;
