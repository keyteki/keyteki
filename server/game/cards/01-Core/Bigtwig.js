const Card = require('../../Card.js');

class Bigtwig extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            match: (card) => card.type === 'creature' && !card.stunned,
            effect: ability.effects.cardCannot('attack', (context) => context.source === this)
        });

        this.reap({
            target: {
                cardType: 'creature',
                gameAction: [ability.actions.stun(), ability.actions.exhaust()]
            },
            effect: 'stun and exhaust {0}'
        });
    }
}

Bigtwig.id = 'bigtwig';

module.exports = Bigtwig;
