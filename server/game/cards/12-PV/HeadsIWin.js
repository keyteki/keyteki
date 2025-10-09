const Card = require('../../Card.js');

class HeadsIWin extends Card {
    // At the end of your turn, you may flip Heads, I Win.
    // During your opponent's turn, after your opponent plays a creature adjacent to a creature of the same house, fulfill Heads, I Win.
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
                    event.card
                        .getHouses()
                        .some((house) => event.card.neighbors.some((c) => c.hasHouse(house)))
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

HeadsIWin.id = 'heads-i-win';

module.exports = HeadsIWin;
