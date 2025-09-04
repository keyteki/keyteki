const Card = require('../../Card.js');

class Corsair extends Card {
    // While your red key is forged, Corsair gets +1 power and gains skirmish.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.player.keys.red,
            targetController: 'current',
            match: (card, context) => card === context.source,
            effect: [ability.effects.modifyPower(1), ability.effects.addKeyword({ skirmish: 1 })]
        });
    }
}

Corsair.id = 'corsair';

module.exports = Corsair;
