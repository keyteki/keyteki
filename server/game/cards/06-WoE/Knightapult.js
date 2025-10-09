const Card = require('../../Card.js');

class Knightapult extends Card {
    // Action: The next time a friendly creature enters play this turn, you may have it enter anywhere in your battleline, ready.
    setupCardAbilities(ability) {
        this.action({
            effect: 'have the next friendly creature enter play anywhere in your battleline, ready',
            gameAction: [
                ability.actions.forRemainderOfTurn({
                    until: {
                        onCardEntersPlay: (event) =>
                            event.card.type === 'creature' &&
                            event.context.game.activePlayer === event.card.controller
                    },
                    multipleTrigger: false,
                    effect: [ability.effects.enterPlayAnywhere(), ability.effects.entersPlayReady()]
                })
            ]
        });
    }
}

Knightapult.id = 'knightapult';

module.exports = Knightapult;
