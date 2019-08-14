const Card = require('../../Card.js');

class ShadowsAmbassador extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            effect: 'allow them to play or use one Shadows card this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.canPlayOrUseHouse('shadows')
            })
        });
    }
}

ShadowsAmbassador.id = 'shadows-ambassador';

module.exports = ShadowsAmbassador;
