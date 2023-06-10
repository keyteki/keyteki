const Card = require('../../Card.js');

class YantzeeGang extends Card {
    // Action: Steal 1A.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.steal()
        });
    }
}

YantzeeGang.id = 'yantzee-gang';

module.exports = YantzeeGang;
