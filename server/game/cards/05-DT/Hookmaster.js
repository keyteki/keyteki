const Card = require('../../Card.js');

class Hookmaster extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.loseAmber((context) => ({
                amount: context.player.isTideHigh() ? 2 : 0
            }))
        });
    }
}

Hookmaster.id = 'hookmaster';

module.exports = Hookmaster;
