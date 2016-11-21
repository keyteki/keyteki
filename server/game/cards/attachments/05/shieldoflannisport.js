const DrawCard = require('../../../drawcard.js');
 
class ShieldOfLannisport extends DrawCard {
    getIncome() {
        return 1;
    }
}

ShieldOfLannisport.code = '05020';

module.exports = ShieldOfLannisport;
