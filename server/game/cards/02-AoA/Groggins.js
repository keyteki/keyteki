const Card = require('../../Card.js');

class Groggins extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            match: (card) => card.type === 'creature' && !card.isOnFlank(),
            effect: ability.effects.cardCannot(
                'attack',
                (context, effectContext) => context.source === effectContext.source
            )
        });
    }
}

Groggins.id = 'groggins';

module.exports = Groggins;
