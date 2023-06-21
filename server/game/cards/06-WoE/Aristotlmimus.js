const Card = require('../../Card.js');

class Aristotlmimus extends Card {
    // After Reap: If Aristotlmimus has a wisdom counter,
    // draw 1 card, archive 1 card, and play a card from your
    // archives. Otherwise, you may play a card from your archives.
    setupCardAbilities(ability) {
        this.reap({
            effect: '{1}',
            effectArgs: (context) =>
                context.source.hasToken('wisdom')
                    ? 'draw a card, archive a card, and play a card from archives'
                    : 'optionally play a card from archives',
            gameAction: ability.actions.conditional((context) => ({
                condition: context.source.hasToken('wisdom'),
                trueGameAction: ability.actions.draw()
            })),
            then: (preThenContext) => ({
                alwaysTriggers: true,
                targets: {
                    archive: {
                        cardCondition: (_, context) => context.source.hasToken('wisdom'),
                        location: 'hand',
                        controller: 'self',
                        gameAction: ability.actions.archive()
                    },
                    play: {
                        optional: !preThenContext.source.hasToken('wisdom'),
                        controller: 'self',
                        location: 'archives',
                        gameAction: ability.actions.playCard()
                    }
                }
            })
        });
    }
}

Aristotlmimus.id = 'aristotlmimus';

module.exports = Aristotlmimus;
