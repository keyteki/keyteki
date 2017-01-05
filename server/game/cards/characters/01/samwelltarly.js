const DrawCard = require('../../../drawcard.js');

class SamwellTarly extends DrawCard {
    getReserve() {
        if(!this.isBlank()) {
            return 1;
        }
    }
}

SamwellTarly.code = '01127';

module.exports = SamwellTarly;
