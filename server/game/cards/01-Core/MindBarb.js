const Card = require('../../Card.js');

class MindBarb extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discardAtRandom()
        });
    }
}

MindBarb.id = 'mind-barb'; // This is a guess at what the id might be - please check it!!!

module.exports = MindBarb;
