const DrawCard = require('../../../drawcard.js');

class Shaggydog extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Rickon Stark',
            effect: [
                ability.effects.modifyStrength(2),
                ability.effects.addIcon('military')
            ]
        });
    }
}

Shaggydog.code = '03014';

module.exports = Shaggydog;
