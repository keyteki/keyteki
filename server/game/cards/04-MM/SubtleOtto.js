const Card = require('../../Card.js');

class SubtleOtto extends Card {
    // Play: Your opponent discards a random card from their hand.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discardAtRandom()
        });
    }
}

SubtleOtto.id = 'subtle-otto';

module.exports = SubtleOtto;
