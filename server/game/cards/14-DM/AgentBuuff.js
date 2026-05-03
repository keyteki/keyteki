const Card = require('../../Card.js');

class AgentBuuff extends Card {
    // After Reap: If you are overwhelmed, give a friendly creature three +1 power counters. Otherwise, give each friendly creature a +1 power counter.
    setupCardAbilities(ability) {
        this.reap({
            alwaysTriggers: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (_, context) => context.player.isOverwhelmed()
            },
            gameAction: ability.actions.conditional((context) => ({
                condition: () => context.player.isOverwhelmed(),
                trueGameAction: ability.actions.addPowerCounter({
                    target: context.target,
                    amount: 3
                }),
                falseGameAction: ability.actions.addPowerCounter({
                    target: context.player.creaturesInPlay,
                    amount: 1
                })
            }))
        });
    }
}

AgentBuuff.id = 'agent-buuff';

module.exports = AgentBuuff;
