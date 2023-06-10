const Card = require('../../Card.js');

class BadPenny extends Card {
    // Destroyed: Return Bad Penny to your hand.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.returnToHand()
        });
    }
}

BadPenny.id = 'bad-penny';

module.exports = BadPenny;
