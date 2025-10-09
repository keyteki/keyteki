const Card = require('../../Card.js');

class ShadowsAmbassador extends Card {
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // Fight/Reap: You may play or use a Shadowscard this turn.
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
