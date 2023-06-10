const Card = require('../../Card.js');

class DestructiveAnalysis extends Card {
    // Play: Deal 2D to a creature. You may purge any number of cards from your archives to deal an additional 2D to the same creature for each card purged this way.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: (preThenContext) => ({
                target: {
                    activePromptTitle: 'Choose which cards to purge',
                    mode: 'unlimited',
                    controller: 'self',
                    location: 'archives',
                    gameAction: [
                        ability.actions.purge(),
                        ability.actions.dealDamage((context) => ({
                            target: preThenContext.target,
                            amount:
                                context.target.filter((card) => card.owner === card.controller)
                                    .length * 2
                        }))
                    ]
                }
            })
        });
    }
}

DestructiveAnalysis.id = 'destructive-analysis';

module.exports = DestructiveAnalysis;
