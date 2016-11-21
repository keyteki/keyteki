const DrawCard = require('../../../drawcard.js');
 
class NorthernRookery extends DrawCard {
    getReserve() {
        return 1;
    }
}

NorthernRookery.code = '02086';

module.exports = NorthernRookery;
