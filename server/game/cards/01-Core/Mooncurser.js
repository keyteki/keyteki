const Card = require('../../Card.js');

class Mooncurser extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.steal()
        });
    }
}

Mooncurser.id = 'mooncurser';

module.exports = Mooncurser;
