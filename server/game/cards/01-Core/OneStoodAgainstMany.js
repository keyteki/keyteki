const Card = require('../../Card.js');

class OneStoodAgainstMany extends Card {
    // Play: Ready and fight with a friendly creature 3times, each time against a different enemy creature. Resolve these fights one at a time.
    setupCardAbilities(ability) {
        this.chosenTargets = [];

        this.play({
            effect: 'make {0} fight against 3 different creatures',
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.fight({
                        resolveFightPostHandler: (_, action) =>
                            (this.chosenTargets = [].concat(action.target))
                    })
                ])
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.sequential([
                    ability.actions.ready({
                        target: preThenContext.target
                    }),
                    ability.actions.fight({
                        target: preThenContext.target,
                        fightCardCondition: (card) => !this.chosenTargets.includes(card),
                        resolveFightPostHandler: (_, action) =>
                            (this.chosenTargets = this.chosenTargets.concat(action.target))
                    })
                ]),
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.sequential([
                        ability.actions.ready({
                            target: preThenContext.target
                        }),
                        ability.actions.fight({
                            target: preThenContext.target,
                            fightCardCondition: (card) => !this.chosenTargets.includes(card)
                        })
                    ])
                }
            })
        });
    }
}

OneStoodAgainstMany.id = 'one-stood-against-many';

module.exports = OneStoodAgainstMany;
