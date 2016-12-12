const DrawCard = require('../../../drawcard.js');

class TheGodsEye extends DrawCard {
    getReserve() {
        return 1;
    }

    getIncome() {
        return 1;
    }
}

TheGodsEye.code = '04058';

module.exports = TheGodsEye;
