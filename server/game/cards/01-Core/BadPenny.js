const Card = require('../../Card.js');

class BadPenny extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.returnToHand()
        });
    }
}

BadPenny.id = 'bad-penny'; // This is a guess at what the id might be - please check it!!!

module.exports = BadPenny;
