const Card = require('../../Card.js');

class Scholar extends Card {
    //After Reap: Draw 1 card.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.draw({ amount: 1 })
        });
    }
}

Scholar.id = 'scholar';

module.exports = Scholar;
