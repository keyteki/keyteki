const Card = require('../../Card.js');

class StarsAligned extends Card {
    // At the start of your opponent's turn, if each player has the same number of creatures, fulfill Stars Aligned.
    setupCardAbilities(ability) {
        this.prophecyReaction({
            when: {
                onTurnStart: (event, context) =>
                    context.game.activePlayer === context.source.controller.opponent &&
                    context.game
                        .getPlayers()
                        .every(
                            (player) =>
                                player.creaturesInPlay.length ===
                                context.source.controller.creaturesInPlay.length
                        )
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

StarsAligned.id = 'stars-aligned';

module.exports = StarsAligned;
