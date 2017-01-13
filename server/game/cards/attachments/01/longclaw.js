const DrawCard = require('../../../drawcard.js');

class Longclaw extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyStrength(1),
                ability.effects.addKeyword('Renown')
            ]
        });
    }
}

Longclaw.code = '01135';

module.exports = Longclaw;
