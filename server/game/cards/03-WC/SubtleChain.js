const Card = require('../../Card.js');

class SubtleChain extends Card {
    // Play: Your opponent discards a random card from their hand.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discardAtRandom()
        });
    }
}

SubtleChain.id = 'subtle-chain';

module.exports = SubtleChain;
