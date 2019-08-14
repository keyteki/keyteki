const Card = require('../../Card.js');

class BrobnarAmbassador extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            effect: 'allow them to play or use one Brobnar card this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.canPlayOrUseHouse('brobnar')
            })
        });
    }
}

BrobnarAmbassador.id = 'brobnar-ambassador';

module.exports = BrobnarAmbassador;
