const Card = require('../../Card.js');

class Fuguru extends Card {
    //Poison.
    //Your opponent draws one fewer card during their draw card phase.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyHandSize(-1)
        });
    }
}

Fuguru.id = 'fuguru';

module.exports = Fuguru;
