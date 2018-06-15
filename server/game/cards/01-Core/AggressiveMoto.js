const DrawCard = require('../../drawcard.js');

class AggressiveMoto extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });
    }
}

AggressiveMoto.id = 'aggressive-moto';

module.exports = AggressiveMoto;
