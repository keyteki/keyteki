const Card = require('../../Card.js');

class Dendrix extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.discardAtRandom()
        });
    }
}

Dendrix.id = 'dendrix';

module.exports = Dendrix;
