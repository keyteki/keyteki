const DrawCard = require('../../../drawcard.js');
 
class NorthernRookery extends DrawCard {
    getReserve() {
        return 1;
    }

    getIncome() {
        return 1;
    }
}

NorthernRookery.code = '04058';

module.exports = NorthernRookery;
