const Card = require('../../Card.js');

class Tentacle extends Card {
    //Taunt. Skirmish.
    //Tentacle cannot reap.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.cardCannot('reap')
        });
    }
}

Tentacle.id = 'tentacle';

module.exports = Tentacle;
