const Card = require('../../Card.js');

class Timequake extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.returnToDeck(context => {
                context.event.amountCardsInPlay = context.player.cardsInPlay.length;
                return {
                    shuffle: true,
                    target: context.player.cardsInPlay
                };
            }),
            then: preThenContext => ({
                alwaysTriggers: true,
                message: '{0} uses {1} to draw {3} card',
                messageArgs: context => [preThenContext.event ? preThenContext.event.amountCardsInPlay - context.player.cardsInPlay.length : 0],
                gameAction: ability.actions.draw(context => ({
                    amount: preThenContext.event ? preThenContext.event.amountCardsInPlay - context.player.cardsInPlay.length : 0
                }))
            })
        });
    }
}

Timequake.id = 'timequake';

module.exports = Timequake;
