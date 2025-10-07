import Card from '../../Card.js';

class WastefulRegret extends Card {
    // During your opponent's turn, after your opponent discards a cards from their hand, fulfill Wasteful Regret.
    setupCardAbilities(ability) {
        this.prophecyReaction({
            when: {
                onCardDiscarded: (event, context) =>
                    context.game.activePlayer === context.source.controller.opponent &&
                    event.location === 'hand' &&
                    event.card.controller === context.source.controller.opponent
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

WastefulRegret.id = 'wasteful-regret';

export default WastefulRegret;
