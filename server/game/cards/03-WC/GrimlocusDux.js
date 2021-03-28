const Card = require('../../Card.js');

class GrimlocusDux extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'exalt {0} twice',
            gameAction: [ability.actions.exalt(), ability.actions.exalt()]
        });
    }
}

GrimlocusDux.id = 'grimlocus-dux';

module.exports = GrimlocusDux;
