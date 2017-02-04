const DrawCard = require('../../../drawcard.js');

class DrownedGodsBlessing extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addTrait('Drowned God')
        });
        this.plotModifiers({
            initiative: 1
        });
    }
}

DrownedGodsBlessing.code = '02112';

module.exports = DrownedGodsBlessing;
