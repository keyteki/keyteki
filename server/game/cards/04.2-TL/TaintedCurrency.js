const DrawCard = require('../../drawcard.js');

class TaintedCurrency extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
    }
}

TaintedCurrency.id = 'tainted-currency'; // This is a guess at what the id might be - please check it!!!

module.exports = TaintedCurrency;
