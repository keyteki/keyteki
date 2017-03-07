const DrawCard = require('../../../drawcard.js');

class Dawn extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.dynamicStrength(() => this.controller.getNumberOfUsedPlots()),
            recalculateWhen: ['onUsedPlotsModified']
        });
        this.whileAttached({
            match: card => card.hasTrait('House Dayne'),
            effect: ability.effects.addKeyword('Intimidate')
        });
    }
}

Dawn.code = '01115';

module.exports = Dawn;
