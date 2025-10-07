import Card from '../../Card.js';

class GoForthAndConquer extends Card {
    // During your opponent's turn, after an enemy creature is used to fight, fulfill Go Forth and Conquer.
    setupCardAbilities(ability) {
        this.prophecyReaction({
            when: {
                onFight: (event, context) =>
                    context.game.activePlayer === context.source.controller.opponent &&
                    event.attacker.controller === context.source.controller.opponent
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

GoForthAndConquer.id = 'go-forth-and-conquer';

export default GoForthAndConquer;
