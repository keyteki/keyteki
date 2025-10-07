import Card from '../../Card.js';

class IhakaOfTheDepths extends Card {
    // After you draw a card during your turn, you may put the top
    // card of your discard on the bottom of your deck.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlaced: (event, context) =>
                    event.drawn &&
                    context.source.controller === event.card.controller &&
                    context.source.controller === context.game.activePlayer &&
                    context.source.controller.discard.length > 0
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

export default IhakaOfTheDepths;
