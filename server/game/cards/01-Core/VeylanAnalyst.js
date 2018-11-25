const Card = require('../../Card.js');

class VeylanAnalyst extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onAbilityResolved: (event, context) =>
                    event.context.player === context.player && event.context.source.type === 'artifact' &&
                    event.context.ability.isAction() && !event.context.ability.isCardPlayed()
            },
            gameAction: ability.actions.gainAmber()
        });
    }
}

VeylanAnalyst.id = 'veylan-analyst'; // This is a guess at what the id might be - please check it!!!

module.exports = VeylanAnalyst;
