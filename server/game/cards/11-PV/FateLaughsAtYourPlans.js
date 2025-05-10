const Card = require('../../Card.js');

class FateLaughsAtYourPlans extends Card {
    // During your opponent's turn, after they play a card that shares a house with a card in their discard pile, fulfill Fate Laughs at Your Plans.
    setupCardAbilities(ability) {
        this.prophecyReaction({
            when: {
                onCardPlayed: (event, context) =>
                    context.game.activePlayer === context.source.controller.opponent &&
                    event.card
                        .getHouses()
                        .some((house) =>
                            context.game.activePlayer.discard.some((card) => card.hasHouse(house))
                        )
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

FateLaughsAtYourPlans.id = 'fate-laughs-at-your-plans';

module.exports = FateLaughsAtYourPlans;
