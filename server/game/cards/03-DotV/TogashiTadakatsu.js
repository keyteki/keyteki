const DrawCard = require('../../drawcard.js');

class TogashiTadakatsu extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.playerCannot('chooseConflictRing')
        });
    }
}

TogashiTadakatsu.id = 'togashi-tadakatsu';

module.exports = TogashiTadakatsu;

