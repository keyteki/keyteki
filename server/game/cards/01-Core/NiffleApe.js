const Card = require('../../Card.js');

class NiffleApe extends Card {
    // While Niffle Ape is attacking, ignore taunt and elusive.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [ability.effects.ignores('taunt'), ability.effects.ignores('elusive')]
        });
    }
}

NiffleApe.id = 'niffle-ape';

module.exports = NiffleApe;
