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
            effect: ability.effects.addIcon('intrigue')
                    //To do: immune to opponents' plot effects
        });
    }
}

SeptaMordane.code = '02101';

module.exports = SeptaMordane;
