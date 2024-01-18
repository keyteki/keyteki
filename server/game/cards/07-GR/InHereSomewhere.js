const Card = require('../../Card.js');

class InHereSomewhere extends Card {
    // Play: If you are haunted, archive 2 cards from your discard pile.
    // Otherwise, discard the top 5 cards of your deck.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.conditional({
                condition: (context) => context.player.isHaunted(),
                trueGameAction: ability.actions.archive((context) => ({
                    promptForSelect: {
                        controller: 'self',
                        location: 'discard',
                        numCards: 2,
                        mode: 'exactly',
                        message: '{0} uses {1} to archive {2}',
                        messageArgs: (cards) => [context.player, context.source.name, cards]
                    }
                })),
                falseGameAction: ability.actions.discard((context) => ({
                    target: context.player.deck.slice(0, 5)
                }))
            }),
            effect: '{1}',
            effectArgs: (context) => [
                context.player.isHaunted()
                    ? 'archive 2 cards from their discard pile'
                    : 'discard the top 5 cards of their deck'
            ]
        });
    }
}

InHereSomewhere.id = 'in-here-somewhere…';

module.exports = InHereSomewhere;
