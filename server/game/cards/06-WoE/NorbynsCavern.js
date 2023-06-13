const Card = require('../../Card.js');

class NorbynsCavern extends Card {
    // Each friendly Æmberling gets +3 power and gains skirmish.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'self',
            match: (card) => card.name === 'Æmberling',
            effect: [ability.effects.modifyPower(3), ability.effects.addKeyword({ skirmish: 1 })]
        });
    }
}

NorbynsCavern.id = 'norbyn-s-cavern';

module.exports = NorbynsCavern;
