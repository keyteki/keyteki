const DrawCard = require('../../../drawcard.js');

class KnightsOfTheSun extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.getNumberOfUsedPlots() >= 3,
            match: this,
            effect: ability.effects.addKeyword('Renown'),
            recalculateWhen: ['onUsedPlotsModified']
        });
    }
}

KnightsOfTheSun.code = '02095';

module.exports = KnightsOfTheSun;
