const Card = require('../../Card.js');

class RadPenny extends Card {
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
