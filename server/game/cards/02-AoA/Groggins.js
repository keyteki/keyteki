const Card = require('../../Card.js');

class Groggins extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            match: (card) => card.type === 'creature' && !card.isOnFlank(),
            effect: ability.effects.cardCannot('attack', (context) => context.source === this)
        });
    }
}

Groggins.id = 'groggins';

module.exports = Groggins;
