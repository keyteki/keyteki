const Card = require('../../Card.js');

class Pelf extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.loseAmber()
        });
    }
}

Pelf.id = 'pelf';

module.exports = Pelf;
