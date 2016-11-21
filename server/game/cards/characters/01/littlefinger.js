const DrawCard = require('../../../drawcard.js');
 
class LittleFinger extends DrawCard {
    getIncome() {
        return 1;
    }
}

LittleFinger.code = '01028';

module.exports = LittleFinger;
