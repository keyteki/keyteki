const Card = require('../../Card.js');

class Swindle extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal({ amount: 3 })
        });
    }
}

Swindle.id = 'swindle';

module.exports = Swindle;
