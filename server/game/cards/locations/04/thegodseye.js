const DrawCard = require('../../../drawcard.js');

class TheGodsEye extends DrawCard {
    setupCardAbilities() {
        // TODO: Cannot be discarded.
        this.plotModifiers({
            reserve: 1,
            gold: 1
        });
    }
}

TheGodsEye.code = '04058';

module.exports = TheGodsEye;
