const DrawCard = require('../../../drawcard.js');
 
class TheArbor extends DrawCard {
    getIncome() {
        return 3;
    }
}

TheArbor.code = '02064';

module.exports = TheArbor;
