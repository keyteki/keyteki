const Card = require('../../Card.js');

class StealerOfSouls extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            message: '{0} uses {1} to purge {2} and gain 1 amber',
            messageArgs: (context) => {
                return [context.player, context.source, context.target];
            },
            when: {
                onDamageDealt: (event, context) =>
                    event.damageSource === context.source &&
                    event.destroyEvent &&
                    event.destroyEvent.resolved
            },
            gameAction: [
                ability.actions.purge((context) => ({
                    target: context.event.card.location === 'discard' ? context.event.card : []
                })),
                ability.actions.gainAmber()
            ]
        });
    }
}

StealerOfSouls.id = 'stealer-of-souls';

module.exports = StealerOfSouls;
