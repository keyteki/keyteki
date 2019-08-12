const Card = require('../../Card.js');

class MarsAmbassador extends Card {
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
