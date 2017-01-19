const DrawCard = require('../../../drawcard.js');

class NorthernRookery extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 1
        });
    }
}

NorthernRookery.code = '02086';

module.exports = NorthernRookery;
