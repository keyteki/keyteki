const Card = require('../../Card.js');

class ISSIndominus extends Card {
    // Action: Exhaust up to 5 friendly Saurian creatures. For each creature exhausted this way, deal 1D to each enemy creature.
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'upTo',
                numCards: 5,
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.hasHouse('saurian'),
                gameAction: ability.actions.exhaust()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.opponent,
                gameAction: ability.actions.dealDamage((context) => ({
                    target: context.player.opponent ? context.player.opponent.creaturesInPlay : [],
                    amount: context.preThenEvents.filter((event) => !event.cancelled).length
                }))
            }
        });
    }
}

ISSIndominus.id = 'iss-indominus';

module.exports = ISSIndominus;
