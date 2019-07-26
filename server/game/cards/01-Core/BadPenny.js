const Card = require('../../Card.js');

class BadPenny extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.returnToHand()
        });
    }
}

BadPenny.id = 'bad-penny';

module.exports = BadPenny;
