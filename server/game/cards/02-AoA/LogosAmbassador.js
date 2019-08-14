const Card = require('../../Card.js');

class LogosAmbassador extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            effect: 'allow them to play or use one Logos card this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.canPlayOrUseHouse('logos')
            })
        });
    }
}

LogosAmbassador.id = 'logos-ambassador';

module.exports = LogosAmbassador;
