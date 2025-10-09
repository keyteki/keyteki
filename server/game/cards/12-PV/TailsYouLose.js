const Card = require('../../Card.js');

class TailsYouLose extends Card {
    // At the end of your turn, you may flip Tails, You Lose.
    // During your opponent's turn, after your opponent plays a creature adjacent to a creature belonging to a different house, fulfill Tails, You Lose.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onTurnEnded: (_, context) =>
                    context.player === this.game.activePlayer && context.source.activeProphecy
            },
            location: 'any',
            optional: true,
            gameAction: ability.actions.flipProphecy((context) => ({
                prophecyCard: context.source
            }))
        });

        this.prophecyReaction({
            when: {
                onCardPlayed: (event, context) =>
                    context.game.activePlayer === context.source.controller.opponent &&
                    event.card.type === 'creature' &&
                    event.card.location === 'play area' &&
                    event.card.neighbors.some((neighbor) =>
                        neighbor.getHouses().some((house) => !event.card.hasHouse(house))
                    )
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

TailsYouLose.id = 'tails-you-lose';

module.exports = TailsYouLose;
