const Card = require('../../Card.js');

class Hookmaster extends Card {
    //Fight: If the tide is high, your opponent loses 2A.
    setupCardAbilities(ability) {
        this.fight({
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.loseAmber({ amount: 2 })
        });
    }
}

Hookmaster.id = 'hookmaster';

module.exports = Hookmaster;
