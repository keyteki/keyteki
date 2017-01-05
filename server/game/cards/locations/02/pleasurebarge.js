const DrawCard = require('../../../drawcard.js');

// TODO: Event immunity, card draw
class PleasureBarge extends DrawCard {
    getIncome() {
        if(!this.isBlank()) {
            return -1;
        }
    }
}

PleasureBarge.code = '02006';

module.exports = PleasureBarge;
