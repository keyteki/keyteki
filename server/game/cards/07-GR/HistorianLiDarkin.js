const Card = require('../../Card.js');

class HistorianLiDarkin extends Card {
    // After Reap: Each player returns the top card of their discard pile to
    // their hand.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.returnToHand((context) => ({
                location: 'discard',
                target: (context.player.discard.length > 0
                    ? [context.player.discard[0]]
                    : []
                ).concat(
                    context.player.opponent && context.player.opponent.discard.length > 0
                        ? [context.player.opponent.discard[0]]
                        : []
                )
            }))
        });
    }
}

HistorianLiDarkin.id = 'historian-li-darkin';

module.exports = HistorianLiDarkin;
