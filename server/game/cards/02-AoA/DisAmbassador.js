const Card = require('../../Card.js');

class DisAmbassador extends Card {
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
