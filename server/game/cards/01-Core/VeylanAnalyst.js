const Card = require('../../Card.js');

class VeylanAnalyst extends Card {
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
