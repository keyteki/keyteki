const DrawCard = require('../../../drawcard.js');

class KnightsOfTheSun extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.plotDiscard.size() >= 3,
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });
    }
}

KnightsOfTheSun.code = '02095';

module.exports = KnightsOfTheSun;
