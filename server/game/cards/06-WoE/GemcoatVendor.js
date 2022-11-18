const Card = require('../../Card.js');

class GemcoatVendor extends Card {
    //Action: Steal 1A. Deal 1D to $this.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.sequential([
                ability.actions.steal({ amount: 1 }),
                ability.actions.dealDamage((context) => ({
                    target: context.source,
                    amount: 1
                }))
            ])
        });
    }
}

GemcoatVendor.id = 'gemcoat-vendor';

module.exports = GemcoatVendor;
