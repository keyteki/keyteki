const Card = require('../../Card.js');

class VeylanAnalyst extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAbilityResolved: (event, context) =>
                    event.context.player === context.player &&
                    event.context.source.type === 'artifact' &&
                    event.context.ability.isAction() &&
                    !event.context.ability.isCardPlayed()
            },
            gameAction: ability.actions.gainAmber()
        });
    }
}

VeylanAnalyst.id = 'veylan-analyst';

module.exports = VeylanAnalyst;
