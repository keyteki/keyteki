const DrawCard = require('../../../drawcard.js');

class SaltyNavigator extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            initiative: 1
        });
    }
}

SaltyNavigator.code = '01076';

module.exports = SaltyNavigator;
