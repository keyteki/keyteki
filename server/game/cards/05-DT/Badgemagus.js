const Card = require('../../Card.js');

class Badgemagus extends Card {
    // Deploy. (This creature can enter play anywhere in your battleline.)
    // Fight: Ready and fight with each of Badgemagus's neighbors, one at a time.
    setupCardAbilities(ability) {
        this.fight({
            effect: 'ready and fight with each of its neighbors one at a time',
            target: {
                cardType: 'creature',
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.fight()
                ])
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.sequential([
                    ability.actions.ready({
                        target: preThenContext.cardStateWhenInitiated.clonedNeighbors.filter(
                            (c) => c !== preThenContext.target
                        )
                    }),
                    ability.actions.fight({
                        target: preThenContext.cardStateWhenInitiated.clonedNeighbors.filter(
                            (c) => c !== preThenContext.target
                        )
                    })
                ])
            })
        });
    }
}

Badgemagus.id = 'badgemagus';

module.exports = Badgemagus;
