const Card = require('../../Card.js');

class WastefulRegret extends Card {
    // During your opponent's turn, after your opponent discards a cards from their hand, fulfill Wasteful Regret.
    setupCardAbilities(ability) {
        this.prophecyReaction({
            when: {
                onCardDiscarded: (event, context) => {
                    console.log(event.card.name, event.card.location);
                    return (
                        context.game.activePlayer === context.source.controller.opponent &&
                        event.location === 'hand'
                    );
                }
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

WastefulRegret.id = 'wasteful-regret';

module.exports = WastefulRegret;
