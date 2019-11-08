const Card = require('../../Card.js');

class TheHowlingPit extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.modifyHandSize(1)
        });
    }
}

TheHowlingPit.id = 'the-howling-pit';

module.exports = TheHowlingPit;
