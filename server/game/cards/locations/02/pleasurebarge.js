const DrawCard = require('../../../drawcard.js');

// TODO: Event immunity, card draw
class PleasureBarge extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            gold: -1
        });
    }
}

PleasureBarge.code = '02006';

module.exports = PleasureBarge;
