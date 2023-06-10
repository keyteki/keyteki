const Card = require('../../Card.js');

class Purify extends Card {
    // Play: Purge a Mutant creature. If you do, discard cards from the top of its controllers deck until you discard a non-Mutant creature or run out of cards. If you discard a non-Mutant creature this way, put it into play under its owners control.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.game.creaturesInPlay.filter((card) => card.hasTrait('mutant')).length > 0,
            optional: false,
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.hasTrait('mutant'),
                gameAction: ability.actions.purge()
            },
            then: (preThenContext) => {
                let deck = preThenContext.target.controller.deck;
                let index = deck.findIndex(
                    (card) => card.type === 'creature' && !card.hasTrait('mutant')
                );
                let discardedCards = index > -1 ? deck.slice(0, index + 1) : deck;
                let card = index > -1 ? deck[index] : null;
                let result = {
                    message: '{0} uses {1} to discard {3}',
                    messageArgs: [discardedCards],
                    gameAction: ability.actions.discard({
                        target: discardedCards
                    })
                };
                if (card && !card.gigantic) {
                    result.then = {
                        message: '{0} uses {1} to put {3} into play',
                        messageArgs: card,
                        gameAction: ability.actions.putIntoPlay({
                            target: card
                        })
                    };
                }
                return result;
            }
        });
    }
}

Purify.id = 'purify';

module.exports = Purify;
