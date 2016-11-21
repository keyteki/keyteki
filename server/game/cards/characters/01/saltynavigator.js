const DrawCard = require('../../../drawcard.js');
 
class SaltyNavigator extends DrawCard {
    getInitiative() {
        return 1;
    }
}

SaltyNavigator.code = '01076';

module.exports = SaltyNavigator;
