const Card = require('../../Card.js');

class Timequake extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.returnToDeck(context => {
                context.event.amountCardsReturned = context.player.cardsInPlay.length;
                return {
                    shuffle: true,
                    target: context.player.cardsInPlay
                };
            }),
            then: preThenContext => ({
                message: '{0} uses {1} to draw {3} card',
                messageArgs: [preThenContext.event.amountCardsReturned],
                gameAction: ability.actions.draw({
                    amount: preThenContext.event && preThenContext.event.amountCardsReturned
                })
            })
        });
    }
}

Timequake.id = 'timequake';

module.exports = Timequake;
