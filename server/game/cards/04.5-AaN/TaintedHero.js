const DrawCard = require('../../drawcard.js');

class TaintedHero extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
    }
}

TaintedHero.id = 'tainted-hero'; // This is a guess at what the id might be - please check it!!!

module.exports = TaintedHero;
