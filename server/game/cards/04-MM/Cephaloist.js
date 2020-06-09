const Card = require('../../Card.js');

class Cephaloist extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.controller.amber >= 4,
            effect: ability.effects.playerCannot('steal')
        });
    }
}

Cephaloist.id = 'cephaloist';

module.exports = Cephaloist;
