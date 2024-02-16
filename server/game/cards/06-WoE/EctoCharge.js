const Card = require('../../Card.js');

class EctoCharge extends Card {
    // Play: Forge a key at +20 A current cost, reduced by 1 A for
    // each card in your discard pile. If you do, purge Ecto-Charge.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forgeKey((context) => {
                const currentCost = context.player.getCurrentKeyCost();
                return {
                    modifier: 20 - Math.min(currentCost + 20, context.player.discard.length)
                };
            }),
            then: {
                gameAction: ability.actions.purge((context) => ({
                    target: context.source
                }))
            }
        });
    }
}

EctoCharge.id = 'ecto-charge';

module.exports = EctoCharge;
