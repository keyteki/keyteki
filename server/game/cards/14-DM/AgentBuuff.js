const Card = require('../../Card.js');

class AgentBuuff extends Card {
    // After Reap: If you are overwhelmed, give a friendly creature three +1 power counters.
    // Otherwise, give each friendly creature a +1 power counter.
    setupCardAbilities(ability) {
        this.reap({
            alwaysTriggers: true,
            target: {
                activePromptTitle: 'Choose a friendly creature',
                cardType: 'creature',
                controller: 'self',
                cardCondition: (_, context) => context.player.isOverwhelmed(),
                gameAction: ability.actions.addPowerCounter({ amount: 3 })
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => !context.player.isOverwhelmed(),
                gameAction: ability.actions.addPowerCounter((context) => ({
                    target: context.player.creaturesInPlay,
                    amount: 1
                }))
            }
        });
    }
}

AgentBuuff.id = 'agent-buuff';

module.exports = AgentBuuff;
