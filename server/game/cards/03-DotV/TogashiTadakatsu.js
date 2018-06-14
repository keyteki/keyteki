const DrawCard = require('../../drawcard.js');

class TogashiTadakatsu extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'any',
            effect: ability.effects.playerCannot('chooseConflictRing')
        });
    }
}

TogashiTadakatsu.id = 'togashi-tadakatsu';

module.exports = TogashiTadakatsu;

