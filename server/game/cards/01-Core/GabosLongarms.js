const Card = require('../../Card.js');

class GabosLongarms extends Card {
    // Before Fight: Choose a creature. Gabos Longarms deals damage to that creature rather than the one it is fighting.
    setupCardAbilities(ability) {
        this.beforeFight({
            target: {
                activePromptTitle: 'Choose a creature to deal damage to',
                cardType: 'creature',
                gameAction: ability.actions.changeEvent((context) => ({
                    event: context.event,
                    attackerTarget: context.target
                }))
            },
            effect: 'deal damage to {0} instead of {1}',
            effectArgs: (context) => context.event.card
        });
    }
}

GabosLongarms.id = 'gabos-longarms';

module.exports = GabosLongarms;
