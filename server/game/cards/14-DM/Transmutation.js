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
                        amount: context.target ? context.target.tokens.power : 0,
                        upTo: true
                    }))
                },
                then: {
                    alwaysTriggers: true,
                    condition: (context) =>
                        context.preThenEvent &&
                        context.preThenEvent.amount > 0 &&
                        context.preThenEvent.card,
                    gameAction: ability.actions.capture((context) => ({
                        amount: context.preThenEvent ? context.preThenEvent.amount : 0,
                        target: context.preThenEvent ? context.preThenEvent.card : undefined
                    }))
                }
            }
        });
    }
}

Transmutation.id = 'transmutation';

module.exports = Transmutation;
