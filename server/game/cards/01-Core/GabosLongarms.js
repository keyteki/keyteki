const Card = require('../../Card.js');

class GabosLongarms extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onFight: (event, context) => event.attacker === context.source
            },
            target: {
                activePromptTitle: 'Choose a creature to deal damage to',
                cardType: 'creature',
                gameAction: ability.actions.changeEvent(context => ({
                    event: context.event,
                    attackerTarget: context.target
                }))
            },
            effect: 'deal damage to {0} instead of {1}',
            effectArgs: context => context.event.card
        });
    }
}

GabosLongarms.id = 'gabos-longarms';

module.exports = GabosLongarms;
