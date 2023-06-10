const Card = require('../../Card.js');

class OptioGorkus extends Card {
    // Elusive.
    // Each of Optio Gorkuss neighbors gains, Destroyed: Move each A on this creature to a neighboring Optio Gorkus.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => card.amber > 0 && context.source.neighbors.includes(card),
            effect: ability.effects.gainAbility('destroyed', {
                target: {
                    cardType: 'creature',
                    cardCondition: (card, context) =>
                        card.name === 'Optio Gorkus' && card.neighbors.includes(context.source),
                    gameAction: [
                        ability.actions.removeAmber((context) => ({
                            target: context.source,
                            all: true
                        })),
                        ability.actions.placeAmber((context) => ({
                            amount: context.source.amber
                        }))
                    ]
                }
            })
        });
    }
}

OptioGorkus.id = 'optio-gorkus';

module.exports = OptioGorkus;
