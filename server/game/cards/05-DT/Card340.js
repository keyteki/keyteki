const Card = require('../../Card.js');

class Card340 extends Card {
    //Poison.
    //Your opponent draws one fewer card during their draw card phase.
    setupCardAbilities(ability) {
        //Keywords: poison
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyHandSize(() => -1)
        });
    }
}

Card340.id = 'card-340';

module.exports = Card340;
