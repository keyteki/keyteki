const Card = require('../../Card.js');

class EnvoyOfEkwirre extends Card {
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

module.exports = EnvoyOfEkwirre;
