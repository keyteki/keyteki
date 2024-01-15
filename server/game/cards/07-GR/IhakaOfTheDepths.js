const Card = require('../../Card.js');

class IhakaOfTheDepths extends Card {
    // After you draw a card during your turn, you may put the top
    // card of your discard on the bottom of your deck.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlaced: (event, context) =>
                    context.player === this.game.activePlayer &&
                    event.drawn &&
                    context.player.discard.length > 0
            },
            optional: true,
            gameAction: ability.actions.returnToDeck((context) => ({
                bottom: true,
                target: context.player.discard[0]
            }))
        });
    }
}

IhakaOfTheDepths.id = 'ihaka-of-the-depths';

module.exports = IhakaOfTheDepths;
