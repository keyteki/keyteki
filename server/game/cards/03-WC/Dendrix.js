const Card = require('../../Card.js');

class Dendrix extends Card {
    // Fight: Your opponent discards a random card from their hand.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.discardAtRandom()
        });
    }
}

Dendrix.id = 'dendrix';

module.exports = Dendrix;
