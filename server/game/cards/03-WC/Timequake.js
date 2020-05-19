const Card = require('../../Card.js');

class Timequake extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.returnToDeck((context) => ({
                shuffle: true,
                target: context.player.cardsInPlay
                    .map((card) => card.upgrades)
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
