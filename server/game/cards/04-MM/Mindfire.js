const Card = require('../../Card.js');

class Mindfire extends Card {
    // Play: Your opponent discards a random card from their hand. Steal 1A for each bonus icon on the discarded card.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent,
            gameAction: ability.actions.discardAtRandom(),
            then: {
                condition: (context) =>
                    context.preThenEvent.cards.length > 0 &&
                    context.preThenEvent.cards[0].bonusIcons.length > 0,
                message: '{0} uses {1} to steal {3} amber',
                messageArgs: (context) =>
                    context.preThenEvent.cards.length > 0
                        ? context.preThenEvent.cards[0].bonusIcons.length
                        : 0,
                gameAction: ability.actions.steal((context) => {
                    return {
                        amount:
                            context.preThenEvent.cards.length > 0
                                ? context.preThenEvent.cards[0].bonusIcons.length
                                : 0
                    };
                })
            }
        });
    }
}

Mindfire.id = 'mindfire';

module.exports = Mindfire;
