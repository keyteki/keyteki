import Card from '../../Card.js';

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
                gameAction: ability.actions.steal({
                    target: preThenContext.player.opponent,
                    amount: preThenContext.target.length
                })
            })
        });
    }
}

TradeSecrets.id = 'trade-secrets';

export default TradeSecrets;
