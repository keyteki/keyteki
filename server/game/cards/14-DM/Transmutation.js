const Card = require('../../Card.js');

class Transmutation extends Card {
    // Play: Give a creature two +1 power counters. You may remove any number of +1 power counters from a friendly creature. That creature captures 1A for each counter removed this way.
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a creature',
                cardType: 'creature',
                gameAction: ability.actions.addPowerCounter({ amount: 2 })
            },
            then: {
                alwaysTriggers: true,
                target: {
                    optional: true,
                    activePromptTitle:
                        'Choose a friendly creature to remove +1 power counters from',
                    cardType: 'creature',
                    controller: 'self',
                    cardCondition: (card) => card.tokens.power > 0,
                    gameAction: ability.actions.removePowerCounter((context) => ({
                        amount: context.target.tokens.power,
                        upTo: true
                    }))
                },
                then: (preThenContext) => ({
                    alwaysTriggers: true,
                    condition: () =>
                        preThenContext.preThenEvent &&
                        preThenContext.preThenEvent.amount > 0 &&
                        preThenContext.preThenEvent.card,
                    gameAction: ability.actions.capture({
                        amount: preThenContext.preThenEvent.amount,
                        target: preThenContext.preThenEvent.card
                    })
                })
            }
        });
    }
}

Transmutation.id = 'transmutation';

module.exports = Transmutation;
