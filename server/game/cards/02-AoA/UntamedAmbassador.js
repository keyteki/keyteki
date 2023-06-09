const Card = require('../../Card.js');

class UntamedAmbassador extends Card {
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // Fight/Reap: You may play or use an Untamedcard this turn.
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
