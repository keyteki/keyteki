const Card = require('../../Card.js');

class Dextre extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture()
        });

        this.destroyed({
            gameAction: ability.actions.returnToDeck()
        });
    }
}

Dextre.id = 'dextre';

module.exports = Dextre;
