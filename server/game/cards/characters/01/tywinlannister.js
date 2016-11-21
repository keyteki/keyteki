const DrawCard = require('../../../drawcard.js');
 
class TywinLannister extends DrawCard {
    getIncome() {
        return 2;
    }
}

TywinLannister.code = '01090';

module.exports = TywinLannister;
