import Card from '../../Card.js';

class TeWhekeKraken extends Card {
    // Play: Exhaust 2 friendly Unfathomable creatures. If you do not, destroy Te-wheke Kraken.
    // Fight/Reap: Deal 2D to a creature, with 2D splash.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'exactly',
                numCards: 2,
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.hasHouse('unfathomable'),
                gameAction: ability.actions.exhaust()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.preThenEvents.filter((event) => !event.cancelled).length < 2,
                gameAction: ability.actions.destroy((context) => ({ target: context.source }))
            }
        });
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({
                    amount: 2,
                    splash: 2
                })
            }
        });
    }
}

TeWhekeKraken.id = 'te-wheke-kraken';

export default TeWhekeKraken;
