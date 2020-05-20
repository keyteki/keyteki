const Card = require('../../Card.js');

class IxxyxliFixfinger extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card !== this && card.hasTrait('martian') && card.type === 'creature',
            effect: ability.effects.modifyArmor(1)
        });
    }
}

IxxyxliFixfinger.id = 'ixxyxli-fixfinger';

module.exports = IxxyxliFixfinger;
