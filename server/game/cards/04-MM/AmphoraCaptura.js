const Card = require('../../Card.js');

class AmphoraCaptura extends Card {
    // Enhance AADDRR.
    // When resolving a bonus icon, you may choose to resolve it as a PT bonus icon instead.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.mayResolveBonusIconsAs('capture')
        });
    }
}

AmphoraCaptura.id = 'amphora-captura';

module.exports = AmphoraCaptura;
