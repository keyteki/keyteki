const Card = require('../../Card.js');

class ZForceAgent14 extends Card {
    // Fight: Gain 1 for each upgrade on Z-Force Agent 14.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.source.upgrades.length
            }))
        });
    }
}

ZForceAgent14.id = 'z-force-agent-14';

module.exports = ZForceAgent14;
