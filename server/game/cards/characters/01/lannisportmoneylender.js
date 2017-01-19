const DrawCard = require('../../../drawcard.js');

class LannisportMoneylender extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            gold: 1
        });
    }
}

LannisportMoneylender.code = '01093';

module.exports = LannisportMoneylender;
