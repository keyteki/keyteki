const Card = require('../../Card.js');

class AmphoraCaptura extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.mayResolveBonusIconsAs('capture')
        });
    }
}

AmphoraCaptura.id = 'amphora-captura';

module.exports = AmphoraCaptura;
