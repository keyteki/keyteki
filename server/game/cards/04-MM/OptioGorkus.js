const Card = require('../../Card.js');

class OptioGorkus extends Card {
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
