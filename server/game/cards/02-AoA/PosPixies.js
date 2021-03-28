const Card = require('../../Card.js');

class PosPixies extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [ability.effects.stealFromPool(), ability.effects.captureFromPool()]
        });
    }
}

PosPixies.id = 'po-s-pixies';

module.exports = PosPixies;
