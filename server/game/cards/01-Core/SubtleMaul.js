const Card = require('../../Card.js');

class SubtleMaul extends Card {
    // Action: Your opponent discards a random card from their hand.
    setupCardAbilities(ability) {
        this.action({
            condition: (context) => context.player.opponent,
            gameAction: ability.actions.discardAtRandom()
        });
    }
}

SubtleMaul.id = 'subtle-maul';

module.exports = SubtleMaul;
