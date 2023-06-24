const Card = require('../../Card.js');

class EctoCharge extends Card {
    // Play: Forge a key at +20A current cost, reduced by 1A for each card in your discard pile (to a minimum of 6).
    // If you do, purge Ecto-Charge.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forgeKey((context) => {
                const currentCost = context.player.getCurrentKeyCost();
                const totalCost = currentCost + 20 - context.player.discard.length;
                return {
                    modifier: -currentCost + Math.max(6, totalCost)
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
