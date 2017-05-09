const DrawCard = require('../../../drawcard.js');

class SeptaMordane extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Sansa Stark',
            effect: [
                ability.effects.modifyStrength(2),
                ability.effects.addKeyword('Renown')
            ]
        });

        this.persistentEffect({
            match: (card) => card.name === 'Arya Stark',
            effect: [
                ability.effects.addIcon('intrigue'),
                ability.effects.immuneTo(card => card.controller !== this.controller && card.getType() === 'plot')
            ]
        });
    }
}

SeptaMordane.code = '02101';

module.exports = SeptaMordane;
