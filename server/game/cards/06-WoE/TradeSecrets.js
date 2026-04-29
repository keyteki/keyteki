const Card = require('../../Card.js');
const { DiscardCardAction } = require('../../GameActions/index.js');

class TradeSecrets extends Card {
    // Play: Discard any number of Ekwidon cards from your hand. Steal
    // 1 Aember icon for each card discarded this way.
    setupCardAbilities(ability) {
        this.play({
            effectStyle: 'all',
            target: {
                controller: 'self',
                mode: 'unlimited',
                location: 'hand',
                cardCondition: (card) => card.hasHouse('ekwidon'),
                gameAction: ability.actions.discard()
            },
            then: (preThenContext) => ({
                gameAction: ability.actions.steal((context) => ({
                    target: preThenContext.player.opponent,
                    amount: DiscardCardAction.collectDiscardedCards(context.preThenEvents || [])
                        .length
                }))
            })
        });
    }
}

TradeSecrets.id = 'trade-secrets';

module.exports = TradeSecrets;
