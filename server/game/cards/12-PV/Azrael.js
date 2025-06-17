const Card = require('../../Card.js');

class Azrael extends Card {
    // After Reap: Until the end of the turn, each friendly creature may fight.
    setupCardAbilities(ability) {
        this.reap({
            effect: 'allow each friendly creature to fight until the end of the turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.canFight(() => true)
            })
        });
    }
}

Azrael.id = 'azrael';

module.exports = Azrael;
