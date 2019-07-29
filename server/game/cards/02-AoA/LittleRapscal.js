const Card = require('../../Card.js');

class LittleRapscal extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'both',
            match: (card, context) => card.type === 'creature' && ability.actions.fight().canAffect(card, context),
            effect: [
                ability.effects.cardCannot('useAction', context => context.source.type === 'creature' && context.ability.title !== 'Fight with this creature'),
                ability.effects.cardCannot('reap')
            ]
        });
    }
}

LittleRapscal.id = 'little-rapscal';

module.exports = LittleRapscal;
