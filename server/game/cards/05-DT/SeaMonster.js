const Card = require('../../Card.js');

class SeaMonster extends Card {
    //Play: Exhaust 2 friendly Unfathomable creatures. If you do not, destroy Sea Monster.
    //Fight/Reap: Deal 2D to a creature with 2D splash.
    setupCardAbilities(ability) {
        this.play({
            target: {
                numCards: '2',
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

SeaMonster.id = 'sea-monster';

module.exports = SeaMonster;
