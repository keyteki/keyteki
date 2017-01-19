const DrawCard = require('../../../drawcard.js');

class DrownedGodsBlessing extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            initiative: 1
        });
    }
}

DrownedGodsBlessing.code = '02112';

module.exports = DrownedGodsBlessing;
