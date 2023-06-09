const Card = require('../../Card.js');

class MindBarb extends Card {
    // Play: Your opponent discards a random card from their hand.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discardAtRandom()
        });
    }
}

MindBarb.id = 'mind-barb';

module.exports = MindBarb;
