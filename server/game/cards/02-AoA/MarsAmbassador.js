const Card = require('../../Card.js');

class MarsAmbassador extends Card {
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // Fight/Reap: You may play or use a Marscard this turn.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            effect: 'allow them to play or use one Mars card this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.canPlayOrUseHouse('mars')
            })
        });
    }
}

MarsAmbassador.id = 'mars-ambassador';

module.exports = MarsAmbassador;
