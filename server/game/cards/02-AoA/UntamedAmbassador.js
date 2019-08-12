const Card = require('../../Card.js');

class UntamedAmbassador extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            effect: 'allow them to play or use one Untamed card this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.canPlayOrUseHouse('untamed')
            })
        });
    }
}

UntamedAmbassador.id = 'untamed-ambassador';

module.exports = UntamedAmbassador;
