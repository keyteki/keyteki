const Card = require('../../Card.js');

class NadaTax extends Card {
    // Play: Your opponent discards a random card from their hand. For each
    // bonus icon on the discarded card, they lose 1A.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.discardAtRandom(),
            then: {
                condition: (context) =>
                    context.preThenEvent.cards.length > 0 &&
                    context.preThenEvent.cards[0].bonusIcons.length > 0,
                message: '{0} uses {1} to make {3} lose {4} amber',
                messageArgs: (context) => [
                    context.player.opponent,
                    context.preThenEvent.cards[0].bonusIcons.length
                ],
                gameAction: ability.actions.loseAmber((context) => ({
                    target: context.player.opponent,
                    amount:
                        context.preThenEvent.cards.length > 0
                            ? context.preThenEvent.cards[0].bonusIcons.length
                            : 0
                }))
            }
        });
    }
}

NadaTax.id = 'nada-tax';

module.exports = NadaTax;
