const Card = require('../../Card.js');

class LittleRapscal extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.type === 'creature',
            effect: [
                ability.effects.cardCannot('useAction', context => context.source.type === 'creature' && context.ability.title !== 'Fight with this creature'),
                ability.effects.cardCannot('reap')
            ]
        });
    }
}

LittleRapscal.id = 'little-rapscal';

module.exports = LittleRapscal;
