const Card = require('../../Card.js');

class Badgemagus extends Card {
    setupCardAbilities(ability) {
        this.fight({
            effect: 'fight with each of its neighbors one at a time',
            target: {
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.fight()
            },
            then: (preThenContext) => ({
                alwaysTrigger: true,
                gameAction: ability.actions.fight((context) => ({
                    target: preThenContext.cardStateWhenInitiated.clonedNeighbors.filter(
                        (c) => c !== context.preThenEvent.card
                    )
                }))
            })
        });
    }
}

Badgemagus.id = 'badgemagus';

module.exports = Badgemagus;
