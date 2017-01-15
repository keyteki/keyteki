const DrawCard = require('../../../drawcard.js');

class KhalDrogo extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.modifyChallengeTypeLimit('military', 1)
        });
    }
}

KhalDrogo.code = '01162';

module.exports = KhalDrogo;
