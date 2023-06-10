const Card = require('../../Card.js');

class Timequake extends Card {
    // Play: Shuffle each friendly card in play into your deck. Draw a card for each card shuffled into your deck this way.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.returnToDeck((context) => ({
                shuffle: true,
                target: context.game.cardsInPlay
                    .map((card) => card.upgrades.filter((c) => c.controller === context.player))
                    .reduce((a, b) => a.concat(b), [])
                    .concat(context.player.cardsInPlay)
            })),
            then: {
                alwaysTriggers: true,
                message: '{0} uses {1} to draw {3} card',
                messageArgs: (context) => [
                    context.preThenEvent
                        ? context.player.deck.length - context.preThenEvent.deckLength
                        : 0
                ],
                gameAction: ability.actions.draw((context) => ({
                    amount: context.preThenEvent
                        ? context.player.deck.length - context.preThenEvent.deckLength
                        : 0
                }))
            }
        });
    }
}

Timequake.id = 'timequake';

module.exports = Timequake;
