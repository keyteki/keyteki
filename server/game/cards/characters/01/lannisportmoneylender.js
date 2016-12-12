const DrawCard = require('../../../drawcard.js');

class LannisportMoneylender extends DrawCard {
    getIncome() {
        return 1;
    }
}

LannisportMoneylender.code = '01093';

module.exports = LannisportMoneylender;
