const Card = require('../../Card.js');

class AgentSixia extends Card {
    //Fight/Reap: Deal 1D to a creature. If the tide is high, stun it.
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
                gameAction: ability.actions.stun({ target: preThenContext.target })
            })
        });
    }
}

AgentSixia.id = 'agent-sixia-';

module.exports = AgentSixia;
