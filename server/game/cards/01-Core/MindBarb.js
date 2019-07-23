const Card = require('../../Card.js');

class MindBarb extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discardAtRandom()
        });
    }
}

MindBarb.id = 'mind-barb';

module.exports = MindBarb;
