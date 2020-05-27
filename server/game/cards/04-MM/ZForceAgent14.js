const Card = require('../../Card.js');

class ZForceAgent14 extends Card {
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
