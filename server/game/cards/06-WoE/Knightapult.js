const Card = require('../../Card.js');

class Knightapult extends Card {
    // Action: The next time a friendly creature enters play this turn, you may have it enter anywhere in your battleline, ready.
    setupCardAbilities(ability) {
        this.action({
            effect:
                'have the next friendly creature enter play anywhere in their battleline, ready',
            gameAction: [
                ability.actions.lastingEffect({
                    target: {
                        cardType: 'creature',
                        controller: 'self'
                    },
                    until: {
                        onCardEntersPlay: (event) =>
                            event.card.type === 'creature' &&
                            event.context.game.activePlayer === event.card.controller,
                        onTurnEnd: () => true
                    },
                    match: (card) => card.type === 'creature',
                    multipleTrigger: false,
                    effect: [
                        ability.effects.enterPlayAnywhere(),
                        ability.effects.entersPlayReady(
                            (card) => card.controller === this.controller
                        )
                    ]
                })
            ]
        });
    }
}

Knightapult.id = 'knightapult';

module.exports = Knightapult;
