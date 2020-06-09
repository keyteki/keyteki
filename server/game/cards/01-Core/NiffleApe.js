const Card = require('../../Card.js');

class NiffleApe extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [ability.effects.ignores('taunt'), ability.effects.ignores('elusive')]
        });
    }
}

NiffleApe.id = 'niffle-ape';

module.exports = NiffleApe;
