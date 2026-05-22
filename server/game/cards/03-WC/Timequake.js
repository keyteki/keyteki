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
                gameAction: ability.actions.draw((context) => ({
                    amount: this.countCardsShuffledIntoDeck(context)
                }))
            }
        });
    }

    countCardsShuffledIntoDeck(context) {
        if (!context.preThenEvents) {
            return 0;
        }

        return context.preThenEvents.filter(
            (event) => !event.cancelled && event.card && event.card.owner === context.player
        ).length;
    }
}

Timequake.id = 'timequake';

module.exports = Timequake;
