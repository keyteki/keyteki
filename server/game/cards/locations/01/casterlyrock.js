const DrawCard = require('../../../drawcard.js');

class CasterlyRock extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.modifyChallengeTypeLimit('intrigue', 1)
        });
    }
}

CasterlyRock.code = '01097';

module.exports = CasterlyRock;
