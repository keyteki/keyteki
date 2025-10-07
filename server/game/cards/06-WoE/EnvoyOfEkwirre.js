import Card from '../../Card.js';

class EnvoyOfEkwirre extends Card {
    // After Reap: Swap Envoy of Ekwirr with one of its neighbors. Also swap all , damage, counters, and upgrades on these creatures.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.player.creaturesInPlay.length > 1,
            target: {
                cardType: 'creature',
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.swap({
                    swapTokens: true,
                    swapUpgrades: true
                })
            },
            effect: 'swap its position, amber, damage, counters, and upgrades with {0}'
        });
    }
}

EnvoyOfEkwirre.id = 'envoy-of-ekwirrĕ';

export default EnvoyOfEkwirre;
