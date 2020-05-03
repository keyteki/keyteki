const Card = require('../../Card.js');

class Timequake extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.returnToDeck(context => {
                context.event.deckLength = context.player.deck.length;
                // Upgrades should also be shuffled (and before their cards)
                let cardsInPlay = context.player.cardsInPlay;
                let upgrades = cardsInPlay.map(card => card.upgrades).reduce((a, b) => a.concat(b), []);
                let cardsToShuffle = cardsInPlay.concat(upgrades);
                return {
                    shuffle: true,
                    target: cardsToShuffle
                };
            }),
            then: preThenContext => ({
                alwaysTriggers: true,
                message: '{0} uses {1} to draw {3} card',
                messageArgs: context => [preThenContext.event ? context.player.deck.length - preThenContext.event.deckLength : 0],
                gameAction: ability.actions.draw(context => ({
                    amount: preThenContext.event ? context.player.deck.length - preThenContext.event.deckLength : 0
                }))
            })
        });
    }
}

Timequake.id = 'timequake';

module.exports = Timequake;
