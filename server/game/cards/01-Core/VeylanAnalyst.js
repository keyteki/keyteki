const Card = require('../../Card.js');

class VeylanAnalyst extends Card {
    // Each time you use an artifact, gain 1<A>.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onUseCard: (event, context) =>
                    event.context.player === context.player && event.card.type === 'artifact'
            },
            gameAction: ability.actions.gainAmber()
        });
    }
}

VeylanAnalyst.id = 'veylan-analyst';

module.exports = VeylanAnalyst;
