const Card = require('../../Card.js');

class AgentSepdia extends Card {
    // (T) Fight/Reap: Deal 1D to a creature. If the tide is high, stun that creature.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 1 })
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: (context) => context.player.isTideHigh(),
                gameAction: ability.actions.stun({ target: preThenContext.target }),
                message: '{0} uses {1} to stun {3}',
                messageArgs: () => preThenContext.target
            })
        });
    }
}

AgentSepdia.id = 'agent-sepdia';

module.exports = AgentSepdia;
