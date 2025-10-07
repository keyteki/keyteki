import Card from '../../Card.js';

class Platopelta extends Card {
    // After Reap: If Platopelta has a wisdom counter, draw 1 card,
    // archive 1 card, and you may put a wisdom counter on
    // Aristotlmimus. Otherwise, archive 1 card.
    setupCardAbilities(ability) {
        this.reap({
            effect: '{1}',
            effectArgs: () => [
                this.hasToken('wisdom')
                    ? 'draw a card, archive a card, and optionally put a wisdom counter on Aristotlmimus'
                    : 'archive a card'
            ],
            gameAction: ability.actions.conditional((context) => ({
                condition: context.source.hasToken('wisdom'),
                trueGameAction: ability.actions.draw()
            })),
            then: {
                alwaysTriggers: true,
                target: {
                    location: 'hand',
                    controller: 'self',
                    gameAction: ability.actions.archive()
                },
                then: {
                    alwaysTriggers: true,
                    target: {
                        cardCondition: (card, context) =>
                            context.source.hasToken('wisdom') && card.name === 'Aristotlmimus',
                        optional: true,
                        location: 'play area',
                        controller: 'any',
                        numCards: 1,
                        gameAction: ability.actions.addWisdomCounter()
                    }
                }
            }
        });
    }
}

Platopelta.id = 'platopelta';

export default Platopelta;
