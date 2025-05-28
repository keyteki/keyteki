const Card = require('../../Card.js');

class LookHowFarYouveCome extends Card {
    // During your opponent's turn, after they play a creature, fulfill Look How Far You've Come.
    setupCardAbilities(ability) {
        this.prophecyReaction({
            when: {
                onCardPlayed: (event, context) =>
                    context.game.activePlayer === context.source.controller.opponent &&
                    event.card.type === 'creature'
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

LookHowFarYouveCome.id = 'look-how-far-you-ve-come';

module.exports = LookHowFarYouveCome;
