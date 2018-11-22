const Card = require('../../Card.js');

class Mooncurser extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.steal()
        });
    }
}

Mooncurser.id = 'mooncurser'; // This is a guess at what the id might be - please check it!!!

module.exports = Mooncurser;
