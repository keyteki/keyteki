const DrawCard = require('../../../drawcard.js');

class TheRoseroad extends DrawCard {
    getIncome() {
        if(!this.isBlank()) {
            return 1;
        }
    }
}

TheRoseroad.code = '01040';

module.exports = TheRoseroad;
