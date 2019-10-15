const Card = require('../../Card.js');

class Rotgrub extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.loseAmber()
        });
        this.reap({
            gameAction: ability.actions.archive()
        });
    }
}

Rotgrub.id = 'rotgrub';

module.exports = Rotgrub;
