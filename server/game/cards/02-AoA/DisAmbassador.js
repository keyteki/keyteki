const Card = require('../../Card.js');

class DisAmbassador extends Card {
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // Fight/Reap: You may play or use a Discard this turn.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            effect: 'allow them to play or use one Dis card this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.canPlayOrUseHouse('dis')
            })
        });
    }
}

DisAmbassador.id = 'dis-ambassador';

module.exports = DisAmbassador;
