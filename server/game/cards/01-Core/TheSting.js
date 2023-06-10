const Card = require('../../Card.js');

class TheSting extends Card {
    // Skip your forge a key step.
    // You get all A spent by your opponent when forging keys.
    // Action: Sacrifice The Sting.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.skipStep('key')
        });

        this.reaction({
            when: {
                onForgeKey: (event, context) =>
                    event.player === context.player.opponent &&
                    context.event.amberSpent - (context.event.amberTaken || 0) > 0
            },
            gameAction: [
                ability.actions.gainAmber((context) => ({
                    amount: context.event.amberSpent
                })),
                ability.actions.changeEvent((context) => ({
                    event: context.event,
                    amberTaken: context.event.amberSpent
                }))
            ],
            effect: 'take {1} amber spent by opponent to forge a key',
            effectArgs: (context) => context.event.amberSpent
        });

        this.action({
            gameAction: ability.actions.sacrifice()
        });
    }
}

TheSting.id = 'the-sting';

module.exports = TheSting;
