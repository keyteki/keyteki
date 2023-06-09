const Card = require('../../Card.js');

class RadPenny extends Card {
    // Play: Steal 1A.
    // Destroyed: Shuffle Rad Penny into your deck.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal()
        });
        this.destroyed({
            gameAction: ability.actions.returnToDeck({ shuffle: true })
        });
    }
}

RadPenny.id = 'rad-penny';

module.exports = RadPenny;
