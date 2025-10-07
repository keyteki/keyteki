import Card from '../../Card.js';

class Overreach extends Card {
    // During your opponent's turn, after an enemy creature is used to reap, fulfill Overreach.
    setupCardAbilities(ability) {
        this.prophecyReaction({
            when: {
                onReap: (event, context) =>
                    context.game.activePlayer === context.source.controller.opponent &&
                    event.card.type === 'creature' &&
                    event.card.controller === context.source.controller.opponent
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

Overreach.id = 'overreach';

export default Overreach;
